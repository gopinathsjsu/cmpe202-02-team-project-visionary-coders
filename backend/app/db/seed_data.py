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
                # Textbooks
                Listing(title="CMPE 202 Software Systems Engineering Textbook", description="Used, good condition. Essential for the course.", price=45.0, seller_id=alice.id, category=Category.textbooks, photo_url="📖"),
                Listing(title="Introduction to Algorithms (CLRS)", description="Hardcover, like new. No markings.", price=80.0, seller_id=bob.id, category=Category.textbooks, photo_url="📘"),
                Listing(title="Campbell Biology 11th Edition", description="Some highlighting, otherwise good.", price=60.0, seller_id=alice.id, category=Category.textbooks, photo_url="🧬"),
                Listing(title="Chemistry: The Central Science", description="Binder version, unused code.", price=55.0, seller_id=bob.id, category=Category.textbooks, photo_url="⚗️"),
                Listing(title="Physics for Scientists and Engineers", description="Vol 1 & 2. Heavy!", price=90.0, seller_id=alice.id, category=Category.textbooks, photo_url="⚛️"),

                # Electronics
                Listing(title="MacBook Pro 13\" 2020", description="8GB RAM, 256GB SSD. Great condition.", price=650.0, seller_id=alice.id, category=Category.gadgets, photo_url="💻"),
                Listing(title="Scientific Calculator TI-84 Plus CE", description="Color screen, rechargeable battery.", price=85.0, seller_id=bob.id, category=Category.gadgets, photo_url="🔢"),
                Listing(title="iPad Air 4th Gen 64GB", description="Sky Blue. Includes case.", price=400.0, seller_id=alice.id, category=Category.gadgets, photo_url="📱"),
                Listing(title="Sony WH-1000XM4 Headphones", description="Noise cancelling, barely used.", price=200.0, seller_id=bob.id, category=Category.gadgets, photo_url="🎧"),
                Listing(title="Logitech MX Master 3 Mouse", description="Ergonomic, great for coding.", price=70.0, seller_id=alice.id, category=Category.gadgets, photo_url="🖱️"),

                # Furniture & Essentials
                Listing(title="Desk Lamp - LED with USB Port", description="Adjustable brightness.", price=15.0, seller_id=alice.id, category=Category.essentials, photo_url="💡"),
                Listing(title="IKEA Office Chair", description="Black, comfortable mesh back.", price=40.0, seller_id=bob.id, category=Category.furniture, photo_url="🪑"),
                Listing(title="Mini Fridge (Compact)", description="Perfect for dorms. Keeps drinks cold.", price=50.0, seller_id=alice.id, category=Category.essentials, photo_url="🧊"),
                Listing(title="Study Desk (White)", description="Simple desk, easy to assemble.", price=30.0, seller_id=bob.id, category=Category.furniture, photo_url="🪑"),
                Listing(title="Electric Kettle", description="Boils water fast. Auto shut-off.", price=20.0, seller_id=alice.id, category=Category.essentials, photo_url="☕"),

                # Clothing & Sports
                Listing(title="University Hoodie (Size M)", description="Grey, warm and cozy.", price=25.0, seller_id=bob.id, category=Category.clothing, photo_url="👕"),
                Listing(title="Soccer Ball (Size 5)", description="Adidas, never used.", price=15.0, seller_id=alice.id, category=Category.sports, photo_url="⚽"),
                Listing(title="Tennis Racket (Wilson)", description="Good grip, lightweight.", price=40.0, seller_id=bob.id, category=Category.sports, photo_url="🎾"),
                Listing(title="Yoga Mat (Thick)", description="Purple, non-slip.", price=15.0, seller_id=alice.id, category=Category.sports, photo_url="🧘"),
                Listing(title="Winter Jacket (North Face)", description="Black, Size L. Very warm.", price=120.0, seller_id=bob.id, category=Category.clothing, photo_url="🧥"),
            ]
            for it in items: session.add(it)
            session.commit()
    print("Seeded mock data.")

if __name__ == "__main__":
    run()
