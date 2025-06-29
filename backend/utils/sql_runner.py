# utils/sql_runner.py

from db.mysql_handler import mysql_connection

def run_custom_sql(sql: str):
    try:
        cursor = mysql_connection.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        headers = [col[0] for col in cursor.description]
        cursor.close()
        return headers, rows
    except Exception as e:
        return ["Error"], [[str(e)]]

def get_cursor():
    """
    Return a reusable MySQL cursor for custom use.
    Caller is responsible for closing the cursor.
    """
    return mysql_connection.cursor()
