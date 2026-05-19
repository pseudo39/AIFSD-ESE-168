require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User.model');

const seed = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    process.exit(0);
  }

  await User.create({
    name: 'Admin',
    email,
    password: password,
    role: 'admin',
  });

  console.log('Admin seeded');
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(async (err) => {
  console.error('Seeding failed:', err.message || err);
  await mongoose.disconnect();
  process.exit(1);
});
