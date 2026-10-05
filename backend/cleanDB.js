const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const initialCategories = [
  { name: 'Refrigerators', description: 'Refrigerators', active: true },
  { name: 'Washing Machines', description: 'Washing Machines', active: true },
  { name: 'Air Conditioners', description: 'Air Conditioners', active: true },
  { name: 'TVs', description: 'Televisions', active: true },
  { name: 'Fans', description: 'Fans', active: true },
  { name: 'Kitchen Appliances', description: 'Kitchen Appliances', active: true },
  { name: 'Water Heaters', description: 'Water Heaters', active: true },
  { name: 'Air Coolers', description: 'Air Coolers', active: true }
];

const cleanDB = async () => {
  try {
    console.log('Cleaning up Demo Products and Brands...');
    await Product.deleteMany({});
    await Brand.deleteMany({});
    console.log('Products and Brands cleared.');

    console.log('Resetting Categories...');
    await Category.deleteMany({});
    
    // Some schemas might require an image field, let's check.
    // If it fails we will catch it.
    for(let cat of initialCategories) {
        try {
            await Category.create(cat);
        } catch(e) {
            console.log("Error creating category without image, trying to bypass or using default...", e.message);
            cat.image = "default.png";
            await Category.create(cat);
        }
    }

    console.log('Categories reset to initial shop categories.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

cleanDB();
