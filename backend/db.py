import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def get_db_connection():
    # Connect to PostgreSQL using DATABASE_URL from environment
    return psycopg2.connect(os.getenv("DATABASE_URL"))