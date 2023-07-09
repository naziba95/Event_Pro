const nodemailer = require('nodemailer');

// Configure the SMTP transport for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jdonenaziba@gmail.com', // Replace with your Gmail email address
    pass: 'xecnszxoevyeporm', // Replace with your Gmail password or app-specific password
  },
});

const sendBirthdayEmail = async (recipientEmail, message) => {
  try {
    // Compose the email message
    const mailOptions = {
      from: 'jdonenaziba@gmail.com', // Replace with your Gmail email address
      to: recipientEmail,
      subject: 'Happy Birthday!',
      text: message,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.log('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = { sendBirthdayEmail };
