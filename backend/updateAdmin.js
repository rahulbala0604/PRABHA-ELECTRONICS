const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const updateAdmin = async () => {
  try {
    // Check if PSV user already exists
    let psvUser = await User.findOne({ name: 'PSV' });
    
    if (psvUser) {
       psvUser.password = '9990';
       psvUser.isAdmin = true;
       await psvUser.save();
       console.log('PSV admin updated successfully!');
    } else {
       // Check if the previous admin exists to just rename them
       let oldAdmin = await User.findOne({ email: 'admin@example.com' });
       if (oldAdmin) {
          oldAdmin.name = 'PSV';
          oldAdmin.password = '9990';
          await oldAdmin.save();
          console.log('Old admin updated to PSV!');
       } else {
          await User.create({
            name: 'PSV',
            email: 'psv@admin.com',
            password: '9990',
            isAdmin: true
          });
          console.log('PSV admin created successfully!');
       }
    }
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateAdmin();
