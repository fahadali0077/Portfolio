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

    // Persist the submission first so nothing is lost even if email fails.
    const contact = new Contact({ name, email, subject, message });
    await contact.save();

    // Verify email is configured before attempting to send.
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email not configured: EMAIL_USER / EMAIL_PASSWORD missing.');
      // Contact is saved, so report partial success rather than failing the user.
      return res.status(201).json({
        success: true,
        message: 'Message received! I will get back to you soon.',
        data: contact
      });
    }

    // Send emails BEFORE responding, so any failure is surfaced to the client.
    try {
      const transporter = createTransporter();
      const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
      const notifyAddress = process.env.EMAIL_TO || process.env.EMAIL_USER;

      // Notification to site owner
      await transporter.sendMail({
        from: fromAddress,
        to: notifyAddress,
        replyTo: email,
        subject: `Portfolio Contact: ${subject}`,
        html: `<h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>`
      });

      // Auto-reply confirmation to the sender
      await transporter.sendMail({
        from: fromAddress,
        to: email,
        subject: 'Thanks for reaching out!',
        html: `<h2>Hi ${name},</h2>
          <p>Thank you for contacting me. I will get back to you as soon as possible.</p>
          <p>Best regards,<br>Fahad Ali</p>`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Contact is already saved; tell the user it was received but email delivery had an issue.
      return res.status(201).json({
        success: true,
        message: 'Message received! (Email confirmation could not be sent, but I have your message.)',
        data: contact
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: contact
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch contacts' });
  }
};
