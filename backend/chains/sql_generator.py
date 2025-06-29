# chains/sql_generator.py

from langchain_google_genai import ChatGoogleGenerativeAI
import os
import re
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash",
    temperature=0.2
)

# Define your database schema here or dynamically load from MySQL
SCHEMA_DESCRIPTION = """
transactions(client_id VARCHAR, stock_name VARCHAR, value DECIMAL, date DATE)
relationship_managers(client_id VARCHAR, manager_name VARCHAR)
"""

def generate_sql_with_gemini(question: str) -> str:
    prompt = f"""
You are an SQL assistant.

Write a MySQL query to answer the question using ONLY the schema below. 
Always alias aggregation columns and use them in ORDER BY.

# Schema:
{SCHEMA_DESCRIPTION}

# Question:
{question}

Respond with valid SQL inside ```sql ... ``` block.
"""

    response = llm.invoke(prompt).content.strip()
    sql_match = re.search(r"```sql(.*?)```", response, re.DOTALL)
    return sql_match.group(1).strip() if sql_match else response.strip()
