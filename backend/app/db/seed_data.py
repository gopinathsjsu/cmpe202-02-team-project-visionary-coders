from sqlmodel import Session, select
from app.db.session import engine
from app.models.user import User, Role
from app.models.listing import Listing, Category
from app.core.security import get_password_hash

def run():
    with Session(engine) as session:
        # Users
        if not session.exec(select(User)).first():
            admin = User(email="admin@univ.edu", name="Admin", role=Role.admin, hashed_password=get_password_hash("adminpass"))
            alice = User(email="alice@univ.edu", name="Alice", role=Role.seller, hashed_password=get_password_hash("alicepass"))
            bob = User(email="bob@univ.edu", name="Bob", role=Role.buyer, hashed_password=get_password_hash("bobpass"))
            session.add(admin); session.add(alice); session.add(bob)
            session.commit()

        # Listings
        if not session.exec(select(Listing)).first():
            alice = session.exec(select(User).where(User.email=="alice@univ.edu")).one()
            items = [
                Listing(title="CMPE 202 Textbook", description="Used, good condition", price=30.0, seller_id=alice.id, category=Category.textbooks),
                Listing(title="Raspberry Pi 4", description="4GB RAM, barely used", price=50.0, seller_id=alice.id, category=Category.gadgets),
                Listing(title="Desk Lamp", description="Bright LED lamp", price=12.0, seller_id=alice.id, category=Category.essentials),
            ]
            for it in items: session.add(it)
            session.commit()
    print("Seeded mock data.")

if __name__ == "__main__":
    run()
