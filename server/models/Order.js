const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orderModel'); // Adjust path if needed
const { protect } = require('../middleware/protect'); // Optional JWT middleware

// @desc   Create a new order
// @route  POST /api/orders
// @access Private (if using auth)
router.post('/', protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    // Check if products exist
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided.' });
    }

    // Convert product IDs to ObjectId
    const formattedProducts = products.map(item => ({
      product: new mongoose.Types.ObjectId(item.product),
      quantity: item.quantity,
    }));

    const order = new Order({
      user: req.user.id, // Make sure protect middleware sets req.user
      products: formattedProducts,
      totalAmount,
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
