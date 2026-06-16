from dotenv import load_dotenv
from pymongo import MongoClient
import os
from .config import settings

client = MongoClient(settings.MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)
db = client[settings.DB_NAME]

users_collection=db["users"]
research_paper_collection=db["research_paper"]
summary_collection=db["summary"]