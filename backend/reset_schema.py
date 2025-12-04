from sqlmodel import SQLModel
from app.db.session import engine
# Import all models to ensure they are registered in metadata
from app.models import *

def reset():
    print("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("Tables dropped. Restart the application to recreate them.")

if __name__ == "__main__":
    reset()
