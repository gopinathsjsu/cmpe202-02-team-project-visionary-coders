import sys
import os

# Ensure the current directory is in the python path so we can import app
sys.path.append(os.getcwd())

from app.core.config import settings

print(f"Resolved DATABASE_URL: {settings.DATABASE_URL}")

if "postgres" in settings.DATABASE_URL:
    print("SUCCESS: Application is configured to use PostgreSQL.")
else:
    print("FAILURE: Application is still using SQLite.")
    sys.exit(1)
