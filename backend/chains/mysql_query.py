import re
from db.mysql_handler import mysql_connection

def query_mysql(question: str):
    cursor = mysql_connection.cursor()
    q = question.lower()

    try:
        # --- 1. Specific stock match
        stock_match = re.search(r"(?:owns|invested in|has|holds)\s+(?:in\s+)?([a-z\s&]+?)\s+stocks?", q)
        if stock_match:
            stock = stock_match.group(1).strip().title()
            cursor.execute("""
                SELECT client_id, stock_name, value
                FROM transactions
                WHERE stock_name = %s
                ORDER BY value DESC
            """, (stock,))
            rows = cursor.fetchall()
            headers = [col[0] for col in cursor.description]
            return {"headers": headers, "rows": rows}

        # --- 2. Client transaction history (Flexible)
        client_match = re.search(
            r"(?:transaction(?:s)?(?: history)?|portfolio)\s+(?:for|of)?\s*(c\d+)", q
        ) or re.search(r"(c\d+).*(?:transaction(?:s)?|portfolio)", q)

        if client_match:
            client_id = client_match.group(1).upper()
            cursor.execute("""
                SELECT stock_name, value, date
                FROM transactions
                WHERE client_id = %s
                ORDER BY date DESC
            """, (client_id,))
            rows = cursor.fetchall()
            headers = [col[0] for col in cursor.description]
            return {"headers": headers, "rows": rows}

        # --- 3. Most diversified portfolios
        if "most number of different stocks" in q or "diverse portfolio" in q:
            cursor.execute("""
                SELECT client_id, COUNT(DISTINCT stock_name) AS unique_stocks
                FROM transactions
                GROUP BY client_id
                ORDER BY unique_stocks DESC
                LIMIT 5
            """)
            rows = cursor.fetchall()
            headers = [col[0] for col in cursor.description]
            return {"headers": headers, "rows": rows}

        # --- 4. General portfolio summary
        if "top" in q or "portfolio" in q or "highest investment" in q:
            cursor.execute("""
                SELECT client_id, SUM(value) AS total_value
                FROM transactions
                GROUP BY client_id
                ORDER BY total_value DESC
                LIMIT 5
            """)
            rows = cursor.fetchall()
            headers = [col[0] for col in cursor.description]
            return {"headers": headers, "rows": rows}

        # --- 5. Fallback
        return {"headers": ["Message"], "rows": [["Sorry, I couldn't understand the MySQL query."]]}
    
    except Exception as e:
        return {"headers": ["Error"], "rows": [[str(e)]]}
    
    finally:
        cursor.close()
