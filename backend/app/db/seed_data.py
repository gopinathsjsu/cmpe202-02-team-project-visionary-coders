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
                Listing(title="CMPE 202 Software Systems Engineering Textbook", description="Used, good condition. Essential for the course.", price=45.0, seller_id=alice.id, category=Category.textbooks, photo_url="📖"),
                Listing(title="MacBook Pro 13\" 2020 - Great Condition", description="8GB RAM, 256GB SSD. Works perfectly.", price=650.0, seller_id=alice.id, category=Category.gadgets, photo_url="💻"),
                Listing(title="Scientific Calculator TI-84", description="Required for calculus and physics.", price=35.0, seller_id=alice.id, category=Category.gadgets, photo_url="🔢"),
                Listing(title="Desk Lamp - LED with USB Port", description="Great for late night study sessions.", price=15.0, seller_id=alice.id, category=Category.essentials, photo_url="💡"),
            ]
            for it in items: session.add(it)
            session.commit()
    print("Seeded mock data.")

if __name__ == "__main__":
    run()
