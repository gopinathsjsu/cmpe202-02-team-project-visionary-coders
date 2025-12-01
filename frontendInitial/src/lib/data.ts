
import type { User, Product, Review } from './types';

const tempUsers: Omit<User, 'reviewsReceived' | 'email' | 'phone' | 'location' | 'memberSince'>[] = [
  {
    id: '1',
    name: 'Sarah Lee',
    avatar: 'user-1',
    rating: 4.9,
    reviews: 2,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'user-2',
    rating: 4.7,
    reviews: 1,
  },
  {
    id: '3',
    name: 'Emily Chen',
    avatar: 'user-3',
    rating: 4.8,
    reviews: 1,
  },
  {
    id: '4',
    name: 'David Kim',
    avatar: 'user-4',
    rating: 4.6,
    reviews: 0,
  },
  {
    id: '5',
    name: 'Jessica Rodriguez',
    avatar: 'user-5',
    rating: 5.0,
    reviews: 0,
  }
];

const reviews: Review[] = [
  {
    id: '1',
    author: {
      id: '2',
      name: 'Mike Johnson',
      avatar: 'user-2',
    },
    rating: 5,
    comment:
      'Great seller! The armchair was in excellent condition, exactly as described. Very friendly and helpful during pickup.',
    date: '1 week ago',
  },
  {
    id: '2',
    author: {
      id: '3',
      name: 'Emily Chen',
      avatar: 'user-3',
    },
    rating: 4,
    comment:
      'Good communication and smooth transaction. The guitar is fantastic! Would buy from Sarah again.',
    date: '3 weeks ago',
  },
  {
    id: '3',
    author: {
      id: '1',
      name: 'Sarah Lee',
      avatar: 'user-1',
    },
    rating: 5,
    comment:
      "Mike was a pleasure to deal with. The bike was in perfect shape and he even helped me load it into my car. Highly recommend!",
    date: '2 weeks ago',
  },
  {
    id: '4',
    author: {
      id: '1',
      name: 'Sarah Lee',
      avatar: 'user-1',
    },
    rating: 5,
    comment:
      'Emily was very responsive and the camera was packed securely. A very trustworthy seller!',
    date: '1 month ago',
  },
];

export const users: User[] = [
  {
    ...tempUsers[0],
    email: 'sarah.lee@sjsu.edu',
    phone: '555-123-4567',
    location: 'Brooklyn, NY',
    memberSince: 'Joined 2 years ago',
    reviewsReceived: [reviews[0], reviews[1]],
  },
  {
    ...tempUsers[1],
    email: 'mike.johnson@sjsu.edu',
    phone: '555-987-6543',
    location: 'Queens, NY',
    memberSince: 'Joined 1 year ago',
    reviewsReceived: [reviews[2]],
  },
  {
    ...tempUsers[2],
    email: 'emily.chen@sjsu.edu',
    phone: '555-456-7890',
    location: 'Manhattan, NY',
    memberSince: 'Joined 3 years ago',
    reviewsReceived: [reviews[3]],
  },
  {
    ...tempUsers[3],
    email: 'david.kim@sjsu.edu',
    phone: '555-321-9876',
    location: 'Jersey City, NJ',
    memberSince: 'Joined 6 months ago',
    reviewsReceived: [],
  },
  {
    ...tempUsers[4],
    email: 'jessica.rodriguez@sjsu.edu',
    phone: '555-654-1234',
    location: 'Brooklyn, NY',
    memberSince: 'Joined 4 months ago',
    reviewsReceived: [],
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Leather Armchair',
    description:
      'A beautiful and comfortable vintage leather armchair, perfect for any living room. Shows some signs of wear consistent with its age, which adds to its character. No major tears or damage.',
    price: 350,
    category: 'Furniture',
    location: { street: '123 Main St', city: 'Brooklyn', zipCode: '11201' },
    distance: 2.5,
    images: ['product-1-1', 'product-1-2', 'product-1-3', 'product-1-4', 'product-1-5'],
    seller: users[0],
    postedDate: '2 days ago',
  },
  {
    id: '2',
    name: 'Trek Mountain Bike',
    description:
      'A barely used Trek Marlin 5 mountain bike. Size M. Great for trails and city riding. Everything is in perfect working order. Selling because I am moving.',
    price: 400,
    category: 'Sporting Goods',
    location: { street: '456 Grand Ave', city: 'Queens', zipCode: '11101' },
    distance: 8.1,
    images: ['product-2-1', 'product-2-2', 'product-2-3', 'product-2-4', 'product-2-5'],
    seller: users[1],
    postedDate: '5 days ago',
  },
  {
    id: '3',
    name: 'Yamaha Acoustic Guitar',
    description:
      'Yamaha FG800 acoustic guitar in mint condition. Rich, warm tone. Comes with a soft case and a new set of strings. Ideal for beginners and intermediate players.',
    price: 180,
    category: 'Musical Instruments',
    location: { street: '789 Park Pl', city: 'Brooklyn', zipCode: '11201' },
    distance: 3.0,
    images: ['product-3-1', 'product-3-2', 'product-3-3', 'product-3-4', 'product-3-5'],
    seller: users[2],
    postedDate: '1 week ago',
  },
  {
    id: '4',
    name: 'Sony A7 III Mirrorless Camera',
    description:
      'Sony A7 III body only. Excellent condition with a low shutter count. An amazing full-frame camera for both photos and videos. Comes with original box, battery, and charger.',
    price: 1200,
    category: 'Electronics',
    location: { street: '101 Broadway', city: 'Manhattan', zipCode: '10001' },
    distance: 5.5,
    images: ['product-4-1', 'product-4-2', 'product-4-3', 'product-4-4', 'product-4-5'],
    seller: users[3],
    postedDate: '3 days ago',
  },
  {
    id: '5',
    name: 'Handmade Ceramic Mugs (Set of 4)',
    description:
      'Set of four beautiful handmade ceramic mugs. Each one is unique. Dishwasher and microwave safe. Perfect for your morning coffee.',
    price: 45,
    category: 'Home & Garden',
    location: { street: '210 Grove St', city: 'Jersey City', zipCode: '07302' },
    distance: 10.2,
    images: ['product-5-1', 'product-5-2', 'product-5-3', 'product-5-4', 'product-5-5'],
    seller: users[4],
    postedDate: '10 days ago',
  },
  {
    id: '6',
    name: 'Modern Minimalist Table Lamp',
    description:
      'Sleek and stylish table lamp with a minimalist design. Provides warm, diffused light. Concrete base and linen shade. Bulb included. Like new.',
    price: 60,
    category: 'Furniture',
    location: { street: '315 5th Ave', city: 'Manhattan', zipCode: '10001' },
    distance: 6.8,
    images: ['product-6-1', 'product-6-2', 'product-6-3', 'product-6-4', 'product-6-5'],
    seller: users[0],
    postedDate: '4 hours ago',
  },
  {
    id: '7',
    name: 'Large Potted Snake Plant',
    description:
      'Healthy, low-maintenance snake plant in a modern ceramic pot. Great for air purification. About 3 feet tall. Pot included.',
    price: 50,
    category: 'Home & Garden',
    location: { street: '400 Flatbush Ave', city: 'Brooklyn', zipCode: '11201' },
    distance: 1.5,
    images: ['product-7-1', 'product-7-2', 'product-7-3', 'product-7-4', 'product-7-5'],
    seller: users[1],
    postedDate: '2 weeks ago',
  },
  {
    id: '8',
    name: 'Leather Commuter Backpack',
    description:
      'A stylish and durable leather backpack perfect for daily commute or travel. Has a padded laptop compartment that fits up to a 15-inch laptop. Multiple pockets for organization.',
    price: 95,
    category: 'Clothing & Accessories',
    location: { street: '50 W 34th St', city: 'Manhattan', zipCode: '10001' },
    distance: 7.2,
    images: ['product-8-1', 'product-8-2', 'product-8-3', 'product-8-4', 'product-8-5'],
    seller: users[2],
    postedDate: '6 days ago',
  },
  {
    id: '9',
    name: 'Fitness Tracker Smartwatch',
    description:
      'A sleek and modern smartwatch with heart rate monitoring, step tracking, and notification alerts. Battery lasts for up to 7 days. Like new condition.',
    price: 75,
    category: 'Electronics',
    location: { street: '110 Bedford Ave', city: 'Brooklyn', zipCode: '11201' },
    distance: 3.5,
    images: ['product-9-1', 'product-9-2', 'product-9-3', 'product-9-4', 'product-9-5'],
    seller: users[3],
    postedDate: '1 day ago',
  },
  {
    id: '10',
    name: 'Introduction to Psychology Textbook',
    description:
      'Used textbook for introductory psychology courses. Good condition with some highlighting in early chapters. No major marks or tears. 8th Edition.',
    price: 40,
    category: 'Books, Movies & Music',
    location: { street: '220 E 42nd St', city: 'Manhattan', zipCode: '10001' },
    distance: 5.1,
    images: ['product-10-1', 'product-10-2', 'product-10-3', 'product-10-4', 'product-10-5'],
    seller: users[4],
    postedDate: '8 days ago',
  },
  {
    id: '11',
    name: 'Portable Bluetooth Speaker',
    description:
      'Compact and powerful Bluetooth speaker with excellent sound quality and 12-hour battery life. Water-resistant, making it perfect for outdoor use. Comes with charging cable.',
    price: 55,
    category: 'Electronics',
    location: { street: '30-30 Steinway St', city: 'Queens', zipCode: '11101' },
    distance: 9.2,
    images: ['product-11-1', 'product-11-2', 'product-11-3', 'product-11-4', 'product-11-5'],
    seller: users[0],
    postedDate: '4 days ago',
  },
  {
    id: '12',
    name: 'Organic Chemistry As a Second Language',
    description:
      'Helpful supplementary textbook for organic chemistry. Explains concepts clearly. Barely used, almost new condition. Latest edition.',
    price: 30,
    category: 'Books, Movies & Music',
    location: { street: '1 Journal Square', city: 'Jersey City', zipCode: '07302' },
    distance: 11.0,
    images: ['product-12-1', 'product-12-2', 'product-12-3', 'product-12-4', 'product-12-5'],
    seller: users[1],
    postedDate: '12 days ago',
  },
  {
    id: '13',
    name: 'TI-84 Plus Graphing Calculator',
    description:
      'Used TI-84 Plus graphing calculator. Perfect for high school and college math and science courses. Works perfectly, some minor cosmetic scratches on the case. Batteries not included.',
    price: 50,
    category: 'Electronics',
    location: { street: '241 DeKalb Ave', city: 'Brooklyn', zipCode: '11201' },
    distance: 4.0,
    images: ['product-13-1', 'product-13-2', 'product-13-3', 'product-13-4', 'product-13-5'],
    seller: users[2],
    postedDate: '1 day ago',
  },
  {
    id: '14',
    name: 'The Great Gatsby - Paperback',
    description:
      'Classic novel by F. Scott Fitzgerald. Paperback version in good condition. No markings on the pages. A must-read for any literature enthusiast.',
    price: 8,
    category: 'Books, Movies & Music',
    location: { street: '476 5th Ave', city: 'Manhattan', zipCode: '10001' },
    distance: 6.2,
    images: ['product-14-1', 'product-14-2', 'product-14-3', 'product-14-4', 'product-14-5'],
    seller: users[3],
    postedDate: '9 days ago',
  },
  {
    id: '15',
    name: 'Noise-Cancelling Headphones',
    description:
      'Over-ear noise-cancelling headphones. Good for studying or commuting. Comes with carrying case and charging cable. Lightly used.',
    price: 65,
    category: 'Electronics',
    location: { street: '31-00 47th Ave', city: 'Queens', zipCode: '11101' },
    distance: 8.8,
    images: ['product-15-1', 'product-15-2', 'product-15-3', 'product-15-4', 'product-15-5'],
    seller: users[4],
    postedDate: '3 days ago',
  },
  {
    id: '16',
    name: 'Dune by Frank Herbert - Hardcover',
    description:
      'Hardcover copy of the science fiction classic, Dune. The cover has slight wear on the corners but the pages are in perfect condition. A great addition to any bookshelf.',
    price: 15,
    category: 'Books, Movies & Music',
    location: { street: '197 St Marks Ave', city: 'Brooklyn', zipCode: '11201' },
    distance: 2.1,
    images: ['product-16-1', 'product-16-2', 'product-16-3', 'product-16-4', 'product-16-5'],
    seller: users[0],
    postedDate: '15 days ago',
  },
  {
    id: '17',
    name: 'Portable Power Bank 10000mAh',
    description:
      'Slim and lightweight 10000mAh power bank. Can charge your phone up to two times. Comes with USB-C and USB-A ports. Barely used.',
    price: 20,
    category: 'Electronics',
    location: { street: '1540 Broadway', city: 'Manhattan', zipCode: '10001' },
    distance: 5.8,
    images: ['product-17-1', 'product-17-2', 'product-17-3', 'product-17-4', 'product-17-5'],
    seller: users[1],
    postedDate: '2 days ago',
  },
  {
    id: '18',
    name: 'Adjustable Laptop Stand',
    description:
      'Ergonomic aluminum laptop stand, adjustable height. Helps with posture during long study sessions. Foldable and portable. Fits laptops 10-16 inches.',
    price: 25,
    category: 'Electronics',
    location: { street: '590 Fulton St', city: 'Brooklyn', zipCode: '11201' },
    distance: 3.1,
    images: ['product-18-1', 'product-18-2', 'product-18-3', 'product-18-4', 'product-18-5'],
    seller: users[2],
    postedDate: '6 days ago',
  },
  {
    id: '19',
    name: 'Electric Kettle',
    description:
      '1.7L electric kettle with auto shut-off. Boils water in minutes, perfect for ramen, tea, or coffee in the dorm. Good condition, recently descaled.',
    price: 18,
    category: 'Home & Garden',
    location: { street: '25-01 Queens Plaza N', city: 'Queens', zipCode: '11101' },
    distance: 9.5,
    images: ['product-19-1', 'product-19-2', 'product-19-3', 'product-19-4', 'product-19-5'],
    seller: users[3],
    postedDate: '11 days ago',
  },
];

    