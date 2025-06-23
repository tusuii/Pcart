const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Log the decoded token for debugging
      console.log('Decoded Token:', decoded);

      // Ensure the decoded token contains a user ID
      if (!decoded.user || !decoded.user.id) {
        return res.status(401).json({ message: 'Invalid token, no user ID' });
      }

      req.user = await User.findById(decoded.user.id).select('-password');

      // Log the found user for debugging
      console.log('Found User:', req.user);

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
