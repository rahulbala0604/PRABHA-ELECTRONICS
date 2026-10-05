const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      return user && user.isAdmin;
    } catch (e) {
      return false;
    }
  }
  return false;
};

module.exports = { isAdmin };
