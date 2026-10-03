const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }
    await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true
    });
    console.log('Admin user created successfully! Email: admin@example.com, Password: password123');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
