// ✅ server/index.js - Corrected version
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
require("dotenv").config();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());

mongoose.connect("mongodb+srv://admin:admin@cluster0.4ana0.mongodb.net/FlipStack", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB...'))
.catch(err => console.error('❌ Could not connect to MongoDB...', err));

const User = require('./models/user');

// ✅ Signup Route (includes phone, address)
app.post('/signup', async (req, res) => {
  const { name, email, password, phone, address, profilePic } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  try {
    const existingUser = await User.findOne({ email: lowerCaseEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      name,
      email: lowerCaseEmail,
      password,
      phone,
      address,
    });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed. Try again." });
  }
});

// ✅ Login Route (with lowercase email and userinfo returned)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const lowerCaseEmail = email.toLowerCase();

  try {
    const user = await User.findOne({ email: lowerCaseEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.json({ success: true, message: "Login successful", userinfo: user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Try again." });
  }
});

// ✅ Optional: Get account by ID
app.get('/account/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});
// ✅ Contact Route using NodeMailer
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Setup transporter
  require('dotenv').config(); 

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com',            
    subject: `New message from ${name}`,
    text: `Sender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
