from sqlmodel import SQLModel
from app.db.session import engine
from app.models import *

def reset():
    print("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)
    print("Tables dropped. Restart the application to recreate them.")

if __name__ == "__main__":
    reset()
