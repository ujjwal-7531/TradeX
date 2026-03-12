const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:5173/verify/${token}`; // Adjust to frontend URL

  const mailOptions = {
    from: '"AnonX" <no-reply@anonx.com>',
    to: email,
    subject: 'Verify your AnonX Account',
    html: `
      <h2>Welcome to AnonX</h2>
      <p>Please click the link below to verify your email address and activate your account:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
