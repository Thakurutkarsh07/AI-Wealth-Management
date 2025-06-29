from db.mongo_handler import get_mongo_collection
import re

def query_mongo(question: str):
    collection = get_mongo_collection("clients")
    q = question.lower()

    try:
        # --- 1. Risk Appetite Queries
        if "high risk" in q or "risk appetite" in q:
            cursor = collection.find({"risk_appetite": "high"}, {"_id": 0})
        
        elif "low risk" in q:
            cursor = collection.find({"risk_appetite": "low"}, {"_id": 0})

        # --- 2. Location / City-based queries
        elif "city" in q or "from" in q or "based in" in q:
            city_match = re.search(r"(?:from|in|based in)\s+([a-zA-Z\s]+)", q)
            if city_match:
                city = city_match.group(1).strip().title()
                cursor = collection.find({"address": city}, {"_id": 0})
            else:
                return {"headers": ["Message"], "rows": [["City not specified in query."]]}
        
        # --- 3. Investment type
# --- 3. Investment preference queries (e.g., gold, equity, etc.)
        elif any(kw in q for kw in ["gold", "equity", "stocks", "bonds", "sip", "fd", "mutual funds", "prefer", "invest"]):
            match = re.search(
                r"(?:invest(?: in)?|prefer(?:s)?(?: to)?(?: invest)?(?: in)?)\s+(gold|equity|stocks?|bonds?|mutual funds?|fd|sip)",
                q
            )
            if match:
                asset = match.group(1).strip().lower()
                cursor = collection.find(
                    {"investment_preferences": {"$in": [re.compile(asset, re.IGNORECASE)]}},
                    {"_id": 0}
                )
            else:
                return {"headers": ["Message"], "rows": [["No investment preference found in query."]]}
       
        # --- 4. Return everything (default)
        else:
            cursor = collection.find({}, {"_id": 0})

        # Prepare output
        rows = list(cursor)
        if not rows:
            return {"headers": ["Message"], "rows": [["No data matched."]]}
        
        headers = list(rows[0].keys())
        return {"headers": headers, "rows": [[row.get(h, "") for h in headers] for row in rows]}

    except Exception as e:
        return {"headers": ["Error"], "rows": [[str(e)]]}
