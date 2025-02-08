const admin = require('../config/firebaseConfig');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'avatars',
    allowedFormats: ['jpg', 'png'],
  },
});

const upload = multer({ storage: storage });

exports.signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ success: false, message: 'Email, name, and password are required.' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    let avatarPath = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      avatarPath = result.secure_url;
    }

    // Create new user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Create new user in MongoDB
    user = new User({
      email,
      name,
      avatar: avatarPath, 
      firebaseUid: userRecord.uid,
      password, // Password will be hashed in the pre-save hook
      role: 'user', 
    });

    await user.save();

    const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    console.log('Login attempt for email:', email);

    // Check if the user exists
    let user = await User.findOne({ email });
    console.log('User found:', user);

    // If no user exists and the email is the admin email, create an admin user
    if (!user && email === 'admin@gmail.com') {
      // Create new admin user in Firebase
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: 'Admin',
      });

      user = new User({
        email,
        password, // Password will be hashed in the pre-save hook
        role: 'admin',
        firebaseUid: userRecord.uid,
      });
      await user.save();
      console.log('Admin user created:', user);
    }

    if (!user) {
      console.error('User not found in MongoDB.');
      return res.status(404).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.isDeactivated) {
      return res.status(403).json({ success: false, message: "Your account is deactivated." });
    }

    // Check if the password is correct
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate a token
    const token = jwt.sign({ uid: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    // Redirect to admin dashboard if the user is an admin
    if (user.role === 'admin') {
      return res.status(200).json({
        success: true,
        message: 'Admin logged in successfully',
        token,
        redirectUrl: '/admin/dashboard',
      });
    }

    // Handle regular user login
    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token,
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};