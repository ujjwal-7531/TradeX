const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const generateUsercode = require('../utils/generateUsercode');
const { sendVerificationEmail } = require('../utils/emailService');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate unique public_usercode
    let public_usercode;
    let isUnique = false;
    while (!isUnique) {
      public_usercode = generateUsercode();
      const existingCode = await User.findOne({ where: { public_usercode } });
      if (!existingCode) isUnique = true;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Generate verification token
    const verification_token = crypto.randomBytes(32).toString('hex');

    // Create user
    user = await User.create({
      email,
      password_hash,
      public_usercode,
      verification_token,
      is_email_verified: false,
    });

    // Send email
    try {
      await sendVerificationEmail(email, verification_token);
    } catch (emailError) {
      console.error('Email failed to send:', emailError);
      // We don't necessarily want to fail registration if email fails in dev
    }

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: {
        id: user.id,
        email: user.email,
        public_usercode: user.public_usercode,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
        public_usercode: user.public_usercode,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            public_usercode: user.public_usercode,
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verification_token: token } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.is_email_verified = true;
    user.verification_token = null;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
