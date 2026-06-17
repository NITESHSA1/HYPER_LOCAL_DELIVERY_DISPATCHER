require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@hyperlocal.com',
    password: 'admin123',
    phone: '9876543210',
    role: 'admin',
    isActive: true,
    address: { street: '123 Admin St', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' }
  },
  {
    name: 'Test Customer',
    email: 'customer@hyperlocal.com',
    password: 'customer123',
    phone: '9876543211',
    role: 'customer',
    isActive: true,
    address: { street: '456 Customer Ave', city: 'Mumbai', state: 'Maharashtra', zipCode: '400002' }
  },
  {
    name: 'Rider One',
    email: 'rider1@hyperlocal.com',
    password: 'rider123',
    phone: '9876543212',
    role: 'rider',
    isActive: true,
    isAvailable: true,
    vehicleType: 'bike',
    vehicleNumber: 'MH-01-AB-1234',
    rating: 4.8,
    totalDeliveries: 156,
    address: { street: '789 Rider Rd', city: 'Mumbai', state: 'Maharashtra', zipCode: '400003' }
  },
  {
    name: 'Rider Two',
    email: 'rider2@hyperlocal.com',
    password: 'rider123',
    phone: '9876543213',
    role: 'rider',
    isActive: true,
    isAvailable: true,
    vehicleType: 'scooter',
    vehicleNumber: 'MH-01-CD-5678',
    rating: 4.5,
    totalDeliveries: 89,
    address: { street: '321 Scooter Lane', city: 'Mumbai', state: 'Maharashtra', zipCode: '400004' }
  },
  {
    name: 'Rider Three',
    email: 'rider3@hyperlocal.com',
    password: 'rider123',
    phone: '9876543214',
    role: 'rider',
    isActive: true,
    isAvailable: false,
    vehicleType: 'car',
    vehicleNumber: 'MH-01-EF-9012',
    rating: 4.9,
    totalDeliveries: 234,
    address: { street: '654 Car Blvd', city: 'Mumbai', state: 'Maharashtra', zipCode: '400005' }
  }
];

const products = [
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, tomatoes, and basil on a thin crispy crust.',
    price: 299,
    originalPrice: 399,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400',
    images: ['https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400'],
    stock: 50,
    unit: 'piece',
    rating: 4.7,
    reviewCount: 120,
    isAvailable: true,
    tags: ['pizza', 'italian', 'vegetarian', 'popular'],
    preparationTime: 25,
    store: { name: 'Pizza Palace', address: '123 Food Street, Mumbai' }
  },
  {
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken pieces, aromatic spices, and saffron.',
    price: 349,
    originalPrice: 449,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400',
    images: ['https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400'],
    stock: 30,
    unit: 'pack',
    rating: 4.8,
    reviewCount: 85,
    isAvailable: true,
    tags: ['biryani', 'indian', 'chicken', 'spicy', 'popular'],
    preparationTime: 40,
    store: { name: 'Royal Biryani House', address: '456 Spice Road, Mumbai' }
  },
  {
    name: 'Fresh Vegetable Box',
    description: 'Assorted fresh seasonal vegetables including tomatoes, onions, potatoes, carrots, spinach, and more.',
    price: 199,
    originalPrice: 249,
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'],
    stock: 100,
    unit: 'box',
    rating: 4.5,
    reviewCount: 45,
    isAvailable: true,
    tags: ['vegetables', 'fresh', 'organic', 'healthy'],
    preparationTime: 15,
    store: { name: 'Fresh Mart', address: '789 Green Street, Mumbai' }
  },
  {
    name: 'Paracetamol 500mg',
    description: 'Pain relief and fever reducer. 10 tablets per strip. For headaches, muscle aches, and fever.',
    price: 25,
    originalPrice: 30,
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
    stock: 200,
    unit: 'pack',
    rating: 4.6,
    reviewCount: 30,
    isAvailable: true,
    tags: ['medicine', 'pain relief', 'essential'],
    preparationTime: 10,
    store: { name: 'City Pharmacy', address: '101 Health Avenue, Mumbai' }
  },
  {
    name: 'Wireless Earbuds',
    description: 'Bluetooth 5.0 wireless earbuds with 24-hour battery life, noise cancellation, and deep bass.',
    price: 1299,
    originalPrice: 1999,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
    stock: 25,
    unit: 'piece',
    rating: 4.3,
    reviewCount: 67,
    isAvailable: true,
    tags: ['electronics', 'audio', 'wireless', 'popular'],
    preparationTime: 20,
    store: { name: 'Tech Hub', address: '222 Gadget Lane, Mumbai' }
  },
  {
    name: 'Men\'s Cotton T-Shirt',
    description: 'Premium quality 100% cotton t-shirt. Comfortable fit, breathable fabric, available in multiple colors.',
    price: 499,
    originalPrice: 699,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    stock: 60,
    unit: 'piece',
    rating: 4.4,
    reviewCount: 92,
    isAvailable: true,
    tags: ['clothing', 'tshirt', 'cotton', 'fashion'],
    preparationTime: 15,
    store: { name: 'Fashion Point', address: '333 Style Street, Mumbai' }
  },
  {
    name: 'Milk 1L',
    description: 'Fresh pasteurized cow milk. Rich in calcium and vitamins.',
    price: 60,
    originalPrice: 65,
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'],
    stock: 150,
    unit: 'liter',
    rating: 4.7,
    reviewCount: 200,
    isAvailable: true,
    tags: ['dairy', 'milk', 'fresh', 'daily essential'],
    preparationTime: 10,
    store: { name: 'Fresh Mart', address: '789 Green Street, Mumbai' }
  },
  {
    name: 'Chocolate Brownie',
    description: 'Rich, fudgy chocolate brownie made with premium Belgian chocolate. Perfect dessert.',
    price: 149,
    originalPrice: 199,
    category: 'food',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=400',
    images: ['https://images.unsplash.com/photo-1606313564200-e75d5e30476d?w=400'],
    stock: 40,
    unit: 'piece',
    rating: 4.9,
    reviewCount: 78,
    isAvailable: true,
    tags: ['dessert', 'chocolate', 'sweet', 'popular'],
    preparationTime: 20,
    store: { name: 'Sweet Tooth Bakery', address: '444 Cake Lane, Mumbai' }
  },
  {
    name: 'Vitamin C Tablets',
    description: 'Immunity boosting vitamin C chewable tablets. 60 tablets per bottle. Orange flavor.',
    price: 199,
    originalPrice: 249,
    category: 'medicine',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400',
    images: ['https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400'],
    stock: 80,
    unit: 'bottle',
    rating: 4.5,
    reviewCount: 55,
    isAvailable: true,
    tags: ['medicine', 'vitamins', 'immunity', 'health'],
    preparationTime: 10,
    store: { name: 'City Pharmacy', address: '101 Health Avenue, Mumbai' }
  },
  {
    name: 'Smart Watch Pro',
    description: 'Advanced fitness tracker with heart rate monitor, GPS, waterproof design, and 7-day battery life.',
    price: 2499,
    originalPrice: 3499,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    stock: 15,
    unit: 'piece',
    rating: 4.6,
    reviewCount: 110,
    isAvailable: true,
    tags: ['electronics', 'smart watch', 'fitness', 'wearable'],
    preparationTime: 25,
    store: { name: 'Tech Hub', address: '222 Gadget Lane, Mumbai' }
  },
  {
    name: 'Basmati Rice 5kg',
    description: 'Premium long-grain basmati rice. Aged for 2 years for perfect aroma and texture.',
    price: 450,
    originalPrice: 550,
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
    stock: 75,
    unit: 'pack',
    rating: 4.6,
    reviewCount: 130,
    isAvailable: true,
    tags: ['grocery', 'rice', 'basmati', 'staple'],
    preparationTime: 15,
    store: { name: 'Fresh Mart', address: '789 Green Street, Mumbai' }
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight breathable running shoes with cushioned sole for maximum comfort and performance.',
    price: 1799,
    originalPrice: 2499,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'],
    stock: 35,
    unit: 'piece',
    rating: 4.4,
    reviewCount: 88,
    isAvailable: true,
    tags: ['clothing', 'shoes', 'sports', 'running'],
    preparationTime: 20,
    store: { name: 'Sportify', address: '555 Athlete Road, Mumbai' }
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Existing data cleared');

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);

    console.log('\nSeed data inserted successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin:    admin@hyperlocal.com / admin123');
    console.log('Customer: customer@hyperlocal.com / customer123');
    console.log('Rider 1:  rider1@hyperlocal.com / rider123');
    console.log('Rider 2:  rider2@hyperlocal.com / rider123');
    console.log('Rider 3:  rider3@hyperlocal.com / rider123');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
