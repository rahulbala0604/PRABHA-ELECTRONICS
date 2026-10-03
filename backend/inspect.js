const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const Enquiry = require('./models/Enquiry');
const User = require('./models/User');
dotenv.config();
const inspect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prabha_electronics');
    const pCount = await Product.countDocuments();
    const cCount = await Category.countDocuments();
    const bCount = await Brand.countDocuments();
    const eCount = await Enquiry.countDocuments();
    const uCount = await User.countDocuments();
    const users = await User.find({}, 'name email isAdmin');
    console.log('Users:', users);
    console.log(`Stats: Products: ${pCount}, Categories: ${cCount}, Brands: ${bCount}, Enquiries: ${eCount}, Users: ${uCount}`);
    
    // Cleanup script
    console.log('Cleaning up...');
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Enquiry.deleteMany({});
    
    // Delete non-admin users
    const nonAdminUserIds = users.filter(u => !u.isAdmin).map(u => u._id);
    await User.deleteMany({ _id: { $in: nonAdminUserIds } });
    
    // Delete admins EXCEPT 'admin@example.com' or the first one if multiple
    const admins = users.filter(u => u.isAdmin);
    if (admins.length > 1) {
       // Keep only one admin (prefer admin@example.com or prabha electronics specific email)
       let mainAdmin = admins.find(a => a.email.includes('admin') || a.email.includes('prabha'));
       if (!mainAdmin) mainAdmin = admins[0];
       
       const otherAdmins = admins.filter(a => a._id.toString() !== mainAdmin._id.toString()).map(a => a._id);
       await User.deleteMany({ _id: { $in: otherAdmins } });
    }
    
    console.log('Cleanup complete.');
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
inspect();
