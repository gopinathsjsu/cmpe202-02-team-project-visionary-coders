import os

env_path = ".env"
# Original content plus the new line, properly formatted
content = """OPENAI_API_KEY = "your_openai_api_key_here"
DATABASE_URL=postgresql://dbadmin:YourStrongPassword123!@fastapi-db-myresourcegroup-west-4.postgres.database.azure.com:5432/fastapidb
"""

with open(env_path, "w") as f:
    f.write(content)

print(f"Fixed {env_path}")
