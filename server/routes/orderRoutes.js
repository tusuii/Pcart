const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/orderModel');
const { protect } = require('../middleware/protect');

router.post('/', protect, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    console.log('Incoming order:', req.body);

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'No products provided.' });
    }

    // Validate product IDs
    for (const p of products) {
      if (!mongoose.Types.ObjectId.isValid(p.product)) {
        return res.status(400).json({ message: `Invalid product ID: ${p.product}` });
      }
    }

    // Convert product strings to ObjectId
    const formattedProducts = products.map(p => ({
      product: new mongoose.Types.ObjectId(p.product),
      quantity: p.quantity
    }));

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: `Invalid user ID: ${req.user._id}` });
    }

    const order = new Order({
      user: req.user._id, // Set from the authenticated user
      products: req.body.products,
      totalAmount: req.body.totalAmount
    });
    await order.save();

    console.log('Order saved:', order);

    return res.status(200).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Order API error:', err);
    return res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;

