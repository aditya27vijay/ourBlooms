import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection
const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log('SMTP server connection established successfully');
  } catch (error) {
    console.error('SMTP server connection failed:', error);
  }
};

export { transporter, verifyConnection };
export default transporter;