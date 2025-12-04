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
            alice = User(email="alice@univ.edu", name="Alice", role=Role.buyer, hashed_password=get_password_hash("password123"))
            bob = User(email="bob@univ.edu", name="Bob", role=Role.buyer, hashed_password=get_password_hash("password123"))
            session.add(admin); session.add(alice); session.add(bob)
            session.commit()

        # Listings
        if not session.exec(select(Listing)).first():
            alice = session.exec(select(User).where(User.email=="alice@univ.edu")).one()
            bob = session.exec(select(User).where(User.email=="bob@univ.edu")).one()
            items = [
                # Textbooks
                Listing(title="Calculus Textbook", description="Advanced Calculus (5th Edition) - Like new condition", price=45.0, seller_id=alice.id, category=Category.textbooks, location="Engineering Building, Room 201", photo_url="https://images.pexels.com/photos/159711/books-bookcase-book-shelf-159711.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Introduction to Algorithms (CLRS)", description="Hardcover, like new. No markings.", price=80.0, seller_id=bob.id, category=Category.textbooks, location="Student Center, 3rd Floor", photo_url="https://images.pexels.com/photos/159707/books-library-ladder-bookshelf-159707.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Organic Chemistry Textbook", description="Organic Chemistry as a Second Language by David Klein - 4th Edition", price=55.0, seller_id=alice.id, category=Category.textbooks, location="Science Hall, Library Entrance", photo_url="https://images.pexels.com/photos/3817517/pexels-photo-3817517.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Physics Lab Kit", description="Complete physics experiment kit with all materials", price=120.0, seller_id=bob.id, category=Category.textbooks, location="Duncan Hall, Room 150", photo_url="https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Biology Textbook", description="Campbell Biology 12th Edition. Some highlighting, otherwise good.", price=60.0, seller_id=alice.id, category=Category.textbooks, location="Life Sciences Building, Lobby", photo_url="https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400"),

                # Electronics
                Listing(title="Gaming Laptop", description="ASUS TUF Gaming Laptop - RTX 3060, 16GB RAM, 512GB SSD", price=850.0, seller_id=alice.id, category=Category.gadgets, location="East Parking Lot, Near Gate A", photo_url="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Scientific Calculator TI-84 Plus CE", description="Color screen, rechargeable battery.", price=85.0, seller_id=bob.id, category=Category.gadgets, location="Math Building, Office 203", photo_url="https://images.pexels.com/photos/159900/calculator-calculation-insurance-finance-159900.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Wireless Headphones", description="Sony WH-1000XM4 - Noise cancelling, 30hr battery", price=220.0, seller_id=alice.id, category=Category.gadgets, location="Recreation Center, Front Desk", photo_url="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Mechanical Keyboard", description="Keychron K2 - RGB backlit, mechanical switches", price=85.0, seller_id=bob.id, category=Category.gadgets, location="Clark Hall, Computer Lab", photo_url="https://images.pexels.com/photos/8200045/pexels-photo-8200045.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Portable Speaker", description="JBL Flip 6 - Waterproof Bluetooth speaker, 12-hour battery life", price=130.0, seller_id=alice.id, category=Category.gadgets, location="Dining Commons, Upper Level", photo_url="https://images.pexels.com/photos/3394649/pexels-photo-3394649.jpeg?auto=compress&cs=tinysrgb&w=400"),

                # Furniture & Essentials
                Listing(title="Desk Lamp - LED with USB Port", description="LED Desk Lamp with USB charging port - adjustable brightness", price=35.0, seller_id=alice.id, category=Category.essentials, location="Residence Hall A, Lounge", photo_url="https://images.pexels.com/photos/3050585/pexels-photo-3050585.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Desk Organizer", description="Bamboo desk organizer with 5 compartments - perfect for supplies and gadgets", price=28.0, seller_id=bob.id, category=Category.essentials, location="Student Commons, Ground Floor", photo_url="https://images.pexels.com/photos/1037994/pexels-photo-1037994.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Coffee Maker", description="Breville Barista Express - Espresso machine, lightly used", price=320.0, seller_id=alice.id, category=Category.essentials, location="Cafe District, Near Library", photo_url="https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="USB-C Hub", description="7-in-1 USB-C Hub with HDMI, USB 3.0, SD card reader - Perfect for MacBook", price=45.0, seller_id=bob.id, category=Category.gadgets, location="Tech Building, Makerspace", photo_url="https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Study Desk (White)", description="Simple desk, easy to assemble.", price=30.0, seller_id=alice.id, category=Category.furniture, location="Dorm Exchange, Loading Area", photo_url="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400"),

                # Clothing & Sports
                Listing(title="University Hoodie (Size M)", description="Grey, warm and cozy.", price=25.0, seller_id=bob.id, category=Category.clothing, location="Quad Central, Bulletin Board", photo_url="https://images.pexels.com/photos/3356408/pexels-photo-3356408.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Mountain Bike", description="Trek X-Caliber 8 - 29er wheels, great for trails", price=600.0, seller_id=alice.id, category=Category.sports, location="Bike Parking Area, Zone B", photo_url="https://images.pexels.com/photos/39284/bicycle-cyclist-riding-sport-39284.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Tennis Racket (Wilson)", description="Good grip, lightweight.", price=40.0, seller_id=bob.id, category=Category.sports, location="Sports Complex, Room 12", photo_url="https://images.pexels.com/photos/50582/tennis-balls-sport-competition-50582.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Yoga Mat", description="Non-slip yoga mat, 6mm thickness, eco-friendly material with carrying strap", price=40.0, seller_id=alice.id, category=Category.sports, location="Wellness Center, Studio 3", photo_url="https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Winter Jacket (North Face)", description="Black, Size L. Very warm.", price=120.0, seller_id=bob.id, category=Category.clothing, location="Clothing Exchange, Room 5", photo_url="https://images.pexels.com/photos/3407817/pexels-photo-3407817.jpeg?auto=compress&cs=tinysrgb&w=400"),
            ]
            for it in items: session.add(it)
            session.commit()
    print("Seeded mock data.")

if __name__ == "__main__":
    run()
