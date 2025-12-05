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
            tej_admin = User(email="tej123@sjsu.edu", name="Tej Kiran", role=Role.admin, hashed_password=get_password_hash("TejAdmin@123"))
            session.add(admin); session.add(alice); session.add(bob); session.add(tej_admin)
            session.commit()

        # Ensure Tej's admin account exists
        tej_admin = session.exec(select(User).where(User.email == "tej123@sjsu.edu")).first()
        if not tej_admin:
            tej_admin = User(
                email="tej123@sjsu.edu",
                name="Tej Kiran",
                role=Role.admin,
                hashed_password=get_password_hash("TejAdmin@123"),
            )
            session.add(tej_admin)
            session.commit()
        # Listings
        if not session.exec(select(Listing)).first():
            alice = session.exec(select(User).where(User.email=="alice@univ.edu")).one()
            bob = session.exec(select(User).where(User.email=="bob@univ.edu")).one()
            items = [
                # Textbooks
                Listing(title="Calculus Textbook", description="Master the fundamentals of Calculus with this comprehensive 5th Edition textbook. Perfect for engineering and science students. The book is in excellent condition with no highlighted pages or notes. Includes access code for online resources.", price=45.0, seller_id=alice.id, category=Category.textbooks, location="Engineering Building, Room 201", photo_url="https://images.pexels.com/photos/159711/books-bookcase-book-shelf-159711.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Introduction to Algorithms (CLRS)", description="The definitive guide to algorithms, commonly known as CLRS. This hardcover edition is essential for any computer science student. It covers a wide range of algorithms in depth. The book is like new, with crisp pages and a pristine cover.", price=80.0, seller_id=bob.id, category=Category.textbooks, location="Student Center, 3rd Floor", photo_url="https://images.pexels.com/photos/159707/books-library-ladder-bookshelf-159707.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Organic Chemistry Textbook", description="Ace your O-Chem class with 'Organic Chemistry as a Second Language'. This 4th edition guide breaks down complex concepts into understandable chunks. Highly recommended by professors. Lightly used with some helpful margin notes.", price=55.0, seller_id=alice.id, category=Category.textbooks, location="Science Hall, Library Entrance", photo_url="https://images.pexels.com/photos/3817517/pexels-photo-3817517.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Physics Lab Kit", description="Don't buy a new kit! This complete physics lab kit contains all the necessary components for the standard university physics sequence. Includes sensors, weights, and measurement tools. All items are clean and fully functional.", price=120.0, seller_id=bob.id, category=Category.textbooks, location="Duncan Hall, Room 150", photo_url="https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Biology Textbook", description="Campbell Biology 12th Edition is the gold standard for introductory biology. This copy has served me well and is ready for a new owner. Some highlighting in key chapters, but the text is fully legible. Great value compared to the bookstore price.", price=60.0, seller_id=alice.id, category=Category.textbooks, location="Life Sciences Building, Lobby", photo_url="https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400"),

                # Electronics
                Listing(title="Gaming Laptop", description="Level up your gaming and productivity with this ASUS TUF Gaming Laptop. Features an NVIDIA RTX 3060 GPU, 16GB of high-speed RAM, and a fast 512GB SSD. Handles modern games and heavy multitasking with ease. In great cosmetic condition with a fresh Windows install.", price=850.0, seller_id=alice.id, category=Category.gadgets, location="East Parking Lot, Near Gate A", photo_url="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Scientific Calculator TI-84 Plus CE", description="Texas Instruments TI-84 Plus CE Graphing Calculator. Features a vibrant color screen and a rechargeable battery that lasts for weeks. Essential for calculus, statistics, and engineering courses. Comes with a slide case and charging cable.", price=85.0, seller_id=bob.id, category=Category.gadgets, location="Math Building, Office 203", photo_url="https://images.pexels.com/photos/159900/calculator-calculation-insurance-finance-159900.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Wireless Headphones", description="Experience silence with the Sony WH-1000XM4 Noise Cancelling Headphones. Industry-leading noise cancellation blocks out distractions, perfect for studying in noisy environments. 30-hour battery life keeps you going all day. Comfortable and lightweight.", price=220.0, seller_id=alice.id, category=Category.gadgets, location="Recreation Center, Front Desk", photo_url="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Mechanical Keyboard", description="Type faster and more comfortably with the Keychron K2 Mechanical Keyboard. Features tactile mechanical switches and customizable RGB backlighting. Compact 75% layout saves desk space while retaining essential keys. Bluetooth and wired connectivity.", price=85.0, seller_id=bob.id, category=Category.gadgets, location="Clark Hall, Computer Lab", photo_url="https://images.pexels.com/photos/8200045/pexels-photo-8200045.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Portable Speaker", description="Bring the party anywhere with the JBL Flip 6. This waterproof Bluetooth speaker delivers powerful, crystal-clear sound. Rugged design makes it perfect for outdoor adventures or dorm room hangouts. 12-hour battery life ensures the music never stops.", price=130.0, seller_id=alice.id, category=Category.gadgets, location="Dining Commons, Upper Level", photo_url="https://images.pexels.com/photos/3394649/pexels-photo-3394649.jpeg?auto=compress&cs=tinysrgb&w=400"),

                # Furniture & Essentials
                Listing(title="Desk Lamp - LED with USB Port", description="Brighten up your workspace with this modern LED Desk Lamp. Features adjustable brightness levels and color temperatures to reduce eye strain. Built-in USB port allows you to charge your phone while you study. Flexible neck for precise lighting.", price=35.0, seller_id=alice.id, category=Category.essentials, location="Residence Hall A, Lounge", photo_url="https://images.pexels.com/photos/3050585/pexels-photo-3050585.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Desk Organizer", description="Keep your desk clutter-free with this eco-friendly bamboo desk organizer. Features 5 spacious compartments for pens, notebooks, phone, and other essentials. Stylish and functional addition to any study setup.", price=28.0, seller_id=bob.id, category=Category.essentials, location="Student Commons, Ground Floor", photo_url="https://images.pexels.com/photos/1037994/pexels-photo-1037994.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Coffee Maker", description="Start your day right with the Breville Barista Express. This semi-automatic espresso machine lets you grind, dose, and extract the perfect shot. Includes a steam wand for latte art. Lightly used and regularly descaled. A must-have for coffee lovers.", price=320.0, seller_id=alice.id, category=Category.essentials, location="Cafe District, Near Library", photo_url="https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="USB-C Hub", description="Expand your laptop's connectivity with this 7-in-1 USB-C Hub. Includes 4K HDMI, USB 3.0 ports, SD/microSD card readers, and USB-C PD charging. Compact and durable aluminum design. Compatible with MacBook Pro/Air and other USB-C devices.", price=45.0, seller_id=bob.id, category=Category.gadgets, location="Tech Building, Makerspace", photo_url="https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Study Desk (White)", description="Simple and sturdy white study desk. Compact design fits perfectly in dorm rooms or small apartments. ample surface area for your laptop and books. Easy to assemble and disassemble. In good condition with minor wear.", price=30.0, seller_id=alice.id, category=Category.furniture, location="Dorm Exchange, Loading Area", photo_url="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400"),

                # Clothing & Sports
                Listing(title="University Hoodie (Size M)", description="Show your school spirit with this official University Hoodie. Size Medium. Made from a soft, durable cotton blend. Features the university logo embroidered on the chest. Perfect for chilly mornings on campus.", price=25.0, seller_id=bob.id, category=Category.clothing, location="Quad Central, Bulletin Board", photo_url="https://images.pexels.com/photos/3356408/pexels-photo-3356408.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Mountain Bike", description="Conquer the trails or commute to class with the Trek X-Caliber 8. This cross-country mountain bike features 29-inch wheels, a lightweight aluminum frame, and a reliable drivetrain. Recently tuned up and ready to ride.", price=600.0, seller_id=alice.id, category=Category.sports, location="Bike Parking Area, Zone B", photo_url="https://images.pexels.com/photos/39284/bicycle-cyclist-riding-sport-39284.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Tennis Racket (Wilson)", description="Wilson Tennis Racket, perfect for intermediate players. Offers a great balance of power and control. Lightweight frame reduces arm fatigue. Grip is in good condition. Includes a protective head cover.", price=40.0, seller_id=bob.id, category=Category.sports, location="Sports Complex, Room 12", photo_url="https://images.pexels.com/photos/50582/tennis-balls-sport-competition-50582.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Yoga Mat", description="Find your zen with this premium non-slip yoga mat. 6mm thickness provides excellent cushioning for joints. Eco-friendly material is free from harmful chemicals. Includes a convenient carrying strap for easy transport to the gym or studio.", price=40.0, seller_id=alice.id, category=Category.sports, location="Wellness Center, Studio 3", photo_url="https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=400"),
                Listing(title="Winter Jacket (North Face)", description="Stay warm this winter with a North Face jacket. Size Large. Features high-quality insulation and a water-resistant shell. Multiple pockets for your essentials. Stylish black design goes with everything. Excellent condition.", price=120.0, seller_id=bob.id, category=Category.clothing, location="Clothing Exchange, Room 5", photo_url="https://images.pexels.com/photos/3407817/pexels-photo-3407817.jpeg?auto=compress&cs=tinysrgb&w=400"),
            ]
            for it in items: session.add(it)
            session.commit()
    print("Seeded mock data.")

if __name__ == "__main__":
    run()
