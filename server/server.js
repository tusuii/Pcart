// server/server.js (or server/index.js)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true }));

// Serve static assets from the client/public/assets folder using absolute path
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));



// Mount API routes
console.log('Mounting product routes...');
app.use('/api/products', productRoutes);

console.log('Mounting user routes...');
app.use('/api/users', userRoutes);

console.log('Mounting order routes...');
app.use('/api/orders', orderRoutes);

console.log('Mounting admin routes...');
app.use('/api/admin', adminRoutes);



// Debug middleware to log all incoming requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
