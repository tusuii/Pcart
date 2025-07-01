const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect, admin } = require('../middleware/authMiddleware');
const Admin = require('../models/Admin');
const Product = require('../models/Product');

console.log('Admin routes loaded');

// Test route
router.get('/test-route', (req, res) => {
    console.log('Admin test route hit');
    res.json({ message: 'Admin test route works from adminRoutes!' });
});

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Private/Admin
console.log('Defining route: POST /register');
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Input validation
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Please provide all required fields',
                required: ['username', 'email', 'password']
            });
        }

        // Check if admin already exists
        const adminExists = await Admin.findOne({ $or: [
            { email: email.trim().toLowerCase() }, 
            { username: username.trim() }
        ]});
        
        if (adminExists) {
            return res.status(400).json({ 
                message: 'Admin with this email or username already exists' 
            });
        }

        // Create new admin
        const admin = new Admin({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: password.trim(),
            role: (role && role.trim()) || 'admin'
        });

        // Validate admin data
        const validationError = admin.validateSync();
        if (validationError) {
            return res.status(400).json({ 
                message: 'Validation failed',
                error: validationError.message 
            });
        }

        // Save admin to database
        const savedAdmin = await admin.save();
        
        // Generate JWT token
        const token = generateToken(savedAdmin._id);

        // Send response
        res.status(201).json({
            message: 'Admin registered successfully',
            user: {
                _id: savedAdmin._id,
                username: savedAdmin.username,
                email: savedAdmin.email,
                role: savedAdmin.role
            },
            token
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ 
            message: 'Server Error',
            error: error.message 
        });
    }
});

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
console.log('Defining route: POST /login');
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Please provide email and password',
                required: ['email', 'password']
            });
        }

        // Find admin by email (case-insensitive)
        const admin = await Admin.findOne({ 
            email: email.trim().toLowerCase() 
        });

        if (!admin) {
            // Don't reveal that the email doesn't exist for security
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Check password
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = generateToken(admin._id);
        
        // Send response
        res.json({
            message: 'Login successful',
            user: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Server Error',
            error: error.message 
        });
    }
});

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
console.log('Defining route: GET /profile');
router.get('/profile', protect, admin, async (req, res) => {
    try {
        // Find admin by ID from the token
        const admin = await Admin.findById(req.admin._id).select('-password');
        
        if (!admin) {
            return res.status(404).json({ 
                message: 'Admin not found' 
            });
        }

        res.json({
            message: 'Profile retrieved successfully',
            user: {
                _id: admin._id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                createdAt: admin.createdAt,
                updatedAt: admin.updatedAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            message: 'Server Error',
            error: error.message 
        });
    }
});

// @desc    Create a product
// @route   POST /products
// @access  Private/Admin
console.log('Defining route: POST /products');
router.post('/products', protect, admin, async (req, res) => {
    try {
        const { name, description, price, countInStock, imageUrl } = req.body;

        // Input validation
        if (!name || !description || price === undefined || countInStock === undefined) {
            return res.status(400).json({ 
                message: 'Please provide all required fields',
                required: ['name', 'description', 'price', 'countInStock']
            });
        }

        const product = new Product({
            name: name.trim(),
            description: description.trim(),
            price: Number(price),
            stock: Number(countInStock),
            imageUrl: (imageUrl && imageUrl.trim()) || '/assets/placeholder.jpg',
            user: req.admin._id
        });

        const validationError = product.validateSync();
        if (validationError) {
            return res.status(400).json({ 
                message: 'Validation failed',
                error: validationError.message 
            });
        }

        const createdProduct = await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: createdProduct
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ 
            message: 'Server Error',
            error: error.message 
        });
    }
});

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private/Admin
console.log('Defining route: PUT /products/:id');
router.put('/products/:id', protect, admin, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const { name, description, price, countInStock, imageUrl } = req.body;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update product fields
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (countInStock) product.stock = countInStock;
        if (imageUrl) product.imageUrl = imageUrl;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ 
            message: 'Server Error',
            error: error.message 
        });
    }
});

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
console.log('Defining route: DELETE /products/:id');
router.delete('/products/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.remove();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = router;
