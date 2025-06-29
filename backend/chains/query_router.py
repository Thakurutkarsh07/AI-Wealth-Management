import re
from db.mysql_handler import mysql_connection
from db.mongo_handler import get_mongo_collection
from chains.mongo_query import query_mongo  # assumes this is working

def route_query(question: str):
    question_lower = question.lower().strip()

    # --- 1. Relationship Manager queries ---
    if "relationship manager" in question_lower or "manager wise" in question_lower:
        cursor = mysql_connection.cursor()
        cursor.execute("""
            SELECT t.client_id, rm.manager_name, SUM(t.value) AS total_value
            FROM transactions t
            JOIN relationship_managers rm ON t.client_id = rm.client_id
            GROUP BY t.client_id, rm.manager_name
            ORDER BY total_value DESC
        """)
        rows = cursor.fetchall()
        headers = [col[0] for col in cursor.description]
        cursor.close()
        return headers, rows

    # --- 2. Client-specific transaction history ---
    client_match = re.search(r"(?:transaction(?:s)?(?: history)?|portfolio|history)[\s\w]*(?:for|of)?\s*(c\d+)", question_lower)
    if client_match:
        client_id = client_match.group(1).upper()
        print(f"✅ Route matched for client_id: {client_id}")
        cursor = mysql_connection.cursor()
        cursor.execute("""
            SELECT stock_name, value, date
            FROM transactions
            WHERE client_id = %s
            ORDER BY date DESC
        """, (client_id,))
        rows = cursor.fetchall()
        headers = [col[0] for col in cursor.description]
        cursor.close()
        return headers, rows

    # --- 3. Stock-specific questions: Who owns X stocks? ---
    stock_match = re.search(r"(?:owns|has|hold(?:s)?|invest(?:ed)? in)\s+([a-z0-9\s&]+)\s+stocks?", question_lower)
    if stock_match:
        stock = stock_match.group(1).strip().title()
        cursor = mysql_connection.cursor()
        cursor.execute("""
            SELECT client_id, stock_name, value
            FROM transactions
            WHERE stock_name = %s
            ORDER BY value DESC
        """, (stock,))
        rows = cursor.fetchall()
        headers = [col[0] for col in cursor.description]
        cursor.close()
        return headers, rows

    # --- 4. Most diversified portfolios ---
    if "most number of different stocks" in question_lower or "diverse portfolio" in question_lower:
        cursor = mysql_connection.cursor()
        cursor.execute("""
            SELECT client_id, COUNT(DISTINCT stock_name) AS unique_stocks
            FROM transactions
            GROUP BY client_id
            ORDER BY unique_stocks DESC
            LIMIT 5
        """)
        rows = cursor.fetchall()
        headers = [col[0] for col in cursor.description]
        cursor.close()
        return headers, rows

    # --- 5. Portfolio summary / top investors ---
    if any(word in question_lower for word in ["top", "most invested", "highest investment"]):
        cursor = mysql_connection.cursor()
        cursor.execute("""
            SELECT client_id, SUM(value) AS total_value
            FROM transactions
            GROUP BY client_id
            ORDER BY total_value DESC
            LIMIT 5
        """)
        rows = cursor.fetchall()
        headers = [col[0] for col in cursor.description]
        cursor.close()
        return headers, rows

    # --- 6. MongoDB-based queries (risk, location, preferences) ---
    mongo_keywords = [
        "risk", "investment", "location", "address", "city", "prefer",
        "gold", "equity", "fd", "sip", "mutual fund", "startups", "bonds", "savings",
        "from", "based"
    ]

    if any(word in question_lower for word in mongo_keywords):
        mongo_result = query_mongo(question)
        return mongo_result["headers"], mongo_result["rows"]

    # --- 7. Default fallback ---
    return ["message"], [["Sorry, I couldn't understand the query."]]
