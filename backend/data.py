from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://utkarshthakur0110:thakur@cluster0.vfyftff.mongodb.net/portfolio-db?retryWrites=true&w=majority&appName=Cluster0")

# Select your database and collection
db = client["portfolio-db"]
clients_collection = db["clients"]


# Step 2: New sample data
new_documents = [
    {"client_id": "C011", "name": "Rohit Mehra", "address": "Chandigarh", "risk_appetite": "medium", "investment_preferences": ["Mutual Funds", "REITs"], "relationship_manager": "Aisha Gupta"},
    {"client_id": "C012", "name": "Priya Sinha", "address": "Bhopal", "risk_appetite": "low", "investment_preferences": ["PPF", "FD"], "relationship_manager": "Sneha Roy"},
    {"client_id": "C013", "name": "Kunal Verma", "address": "Nagpur", "risk_appetite": "high", "investment_preferences": ["Crypto", "Stocks"], "relationship_manager": "Ravi Kapoor"},
    {"client_id": "C014", "name": "Neha Rathi", "address": "Surat", "risk_appetite": "medium", "investment_preferences": ["Gold", "SIPs"], "relationship_manager": "Aisha Gupta"},
    {"client_id": "C015", "name": "Manoj Nair", "address": "Thiruvananthapuram", "risk_appetite": "low", "investment_preferences": ["Savings", "Govt Bonds"], "relationship_manager": "Sneha Roy"},
    {"client_id": "C016", "name": "Divya Aggarwal", "address": "Lucknow", "risk_appetite": "high", "investment_preferences": ["Startups", "Crypto"], "relationship_manager": "Ravi Kapoor"},
    {"client_id": "C017", "name": "Aditya Malhotra", "address": "Guwahati", "risk_appetite": "medium", "investment_preferences": ["SIP", "Mutual Funds"], "relationship_manager": "Aisha Gupta"},
    {"client_id": "C018", "name": "Meera Iyer", "address": "Chennai", "risk_appetite": "low", "investment_preferences": ["FD", "Savings"], "relationship_manager": "Sneha Roy"},
    {"client_id": "C019", "name": "Tanishq Arora", "address": "Jaipur", "risk_appetite": "high", "investment_preferences": ["Stocks", "Equity"], "relationship_manager": "Ravi Kapoor"},
    {"client_id": "C020", "name": "Riya Das", "address": "Bhubaneswar", "risk_appetite": "medium", "investment_preferences": ["REITs", "Gold"], "relationship_manager": "Aisha Gupta"},
    {"client_id": "C021", "name": "Amit Trivedi", "address": "Rajkot", "risk_appetite": "low", "investment_preferences": ["PPF", "FD"], "relationship_manager": "Sneha Roy"},
    {"client_id": "C022", "name": "Sneha Kulkarni", "address": "Aurangabad", "risk_appetite": "high", "investment_preferences": ["Crypto", "Startups"], "relationship_manager": "Ravi Kapoor"},
    {"client_id": "C023", "name": "Zoya Khan", "address": "Patna", "risk_appetite": "medium", "investment_preferences": ["Mutual Funds", "Gold"], "relationship_manager": "Aisha Gupta"},
    {"client_id": "C024", "name": "Nikhil Bansal", "address": "Udaipur", "risk_appetite": "low", "investment_preferences": ["Govt Bonds", "FD"], "relationship_manager": "Sneha Roy"},
    {"client_id": "C025", "name": "Ananya Reddy", "address": "Vijayawada", "risk_appetite": "high", "investment_preferences": ["Stocks", "Equity"], "relationship_manager": "Ravi Kapoor"},
    {"client_id": "C026", "name": "Harshita Sen", "address": "Agra", "risk_appetite": "medium", "investment_preferences": ["SIP", "REITs"], "relationship_manager": "Aisha Gupta"},
    {"client_id": "C027", "name": "Saurav Pandey", "address": "Varanasi", "risk_appetite": "low", "investment_preferences": ["PPF", "Savings"], "relationship_manager": "Sneha Roy"},
    {"client_id": "C028", "name": "Ishaan Bhatt", "address": "Amritsar", "risk_appetite": "high", "investment_preferences": ["Crypto", "Startups"], "relationship_manager": "Ravi Kapoor"},
    {"client_id": "C029", "name": "Kritika Shah", "address": "Coimbatore", "risk_appetite": "medium", "investment_preferences": ["Mutual Funds", "Gold"], "relationship_manager": "Aisha Gupta"},
    {"client_id": "C030", "name": "Dev Mehta", "address": "Mysore", "risk_appetite": "low", "investment_preferences": ["FD", "Savings"], "relationship_manager": "Sneha Roy"},
]

# Step 3: Insert new documents
result = clients_collection.insert_many(new_documents)
print("Inserted new client IDs:", result.inserted_ids)
