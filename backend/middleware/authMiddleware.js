const jwt = require('jsonwebtoken');
const User = require('../models/User');  

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please sign in to access this page.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.id); 
    console.log("Fetched User:", user);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token. Please sign in again.' });
  }
};

module.exports = authMiddleware;
