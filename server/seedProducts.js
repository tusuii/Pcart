const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const products = [
  {
    name: 'Rubik\'s Cube',
    description: 'Classic 3x3 puzzle cube',
    price: 12.99,
    stock: 20,
    imageUrl: 'https://m.media-amazon.com/images/I/71sFta1zRJL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    name: 'Puzzle Box',
    description: 'Wooden puzzle box with secret compartments',
    price: 24.99,
    stock: 15,
    imageUrl: 'https://m.media-amazon.com/images/I/81K5yFqLZAL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    name: 'Jigsaw Puzzle',
    description: '1000 piece landscape puzzle',
    price: 19.99,
    stock: 8,
    imageUrl: 'https://m.media-amazon.com/images/I/91qFKLq14eL._AC_UF1000,1000_QL80_.jpg'
  }
];

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add new products
    const createdProducts = await Product.insertMany(products);
    console.log('Seeded products:', createdProducts);

    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
