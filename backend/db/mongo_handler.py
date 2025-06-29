from pymongo import MongoClient
import os

def get_mongo_collection(collection_name):
    uri = os.getenv("MONGO_URI")
    client = MongoClient(uri)
    db = client.get_default_database()  # Automatically uses the DB from URI
    return db[collection_name]
