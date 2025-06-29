# mysql.py
import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

mysql_connection = mysql.connector.connect(
    host=os.getenv("MYSQL_HOST", "localhost"),
    user=os.getenv("MYSQL_USER", "root"),
    password=os.getenv("MYSQL_PASSWORD", ""),
    database=os.getenv("MYSQL_DATABASE", "portfolio_db")
)
