import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path="app/.env")

database_url = os.getenv("DATABASE_URL")
print(f"Testing connection to: {database_url}")

if not database_url:
    print("DATABASE_URL not found in .env")
    sys.exit(1)

try:
    engine = create_engine(database_url)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful!")
        for row in result:
            print(row)
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)
