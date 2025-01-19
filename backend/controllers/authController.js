const admin = require('../config/firebaseConfig');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
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

    // Check if user already exists
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
      password, 
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


    let user = await User.findOne({ email });

    if (!user) {
      console.error('User not found in MongoDB.');
      return res.status(404).json({ success: false, message: 'Invalid email or password.' });
    }


    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }


    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_TIME,
    });

    console.log(`JWT token generated for ${user.role}:`, token);


    return res.status(200).json({
      success: true,
      token,
      role: user.role,
    });
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};