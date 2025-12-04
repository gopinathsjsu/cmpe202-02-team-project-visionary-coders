import os

env_path = "app/.env"
content = "DATABASE_URL=postgresql://dbadmin:YourStrongPassword123!@fastapi-db-myresourcegroup-west-4.postgres.database.azure.com:5432/fastapidb"

with open(env_path, "w") as f:
    f.write(content)

print(f"Updated {env_path}")
