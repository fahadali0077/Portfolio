const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

exports.submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Save to database
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    // Respond immediately — don't wait for email
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: contact
    });

    // Send emails in background after response
    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_TO,
        subject: `Portfolio Contact: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Sent from your portfolio contact form</small></p>
        `
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Thanks for reaching out!',
        html: `
          <h2>Hi ${name},</h2>
          <p>Thank you for contacting me. I've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Fahad Ali</p>
        `
      });

      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};