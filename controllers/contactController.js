const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // STARTTLS on port 587
    auth: {
      user: process.env.EMAIL_USER, // Brevo SMTP login (e.g. xxxx@smtp-brevo.com)
      pass: process.env.EMAIL_PASSWORD // Brevo SMTP key
    },
    // Hard timeouts so a stalled SMTP connection can never hang the request.
    connectionTimeout: 10000, // 10s to establish the connection
    greetingTimeout: 10000,   // 10s to receive the SMTP greeting
    socketTimeout: 15000      // 15s of socket inactivity
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

    // Respond to the user as soon as the message is saved. Email delivery
    // (notification + auto-reply) happens in the background afterwards, so a
    // slow or misconfigured SMTP server can never hang the user's request.
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! I will get back to you soon.',
      data: contact
    });

    // ── Background email (does not block the response above) ──
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email not configured: EMAIL_USER / EMAIL_PASSWORD missing. Message saved only.');
      return;
    }

    // With Brevo, EMAIL_USER is the SMTP *login* (e.g. xxxx@smtp-brevo.com),
    // which is NOT a valid sender. The "from" address must be a sender you've
    // verified in Brevo, so default to your real address, configurable via env.
    const VERIFIED_SENDER = 'fahada00698@gmail.com';
    const fromAddress = process.env.EMAIL_FROM || VERIFIED_SENDER;
    const notifyAddress = process.env.EMAIL_TO || VERIFIED_SENDER;
    const transporter = createTransporter();

    // Notification to site owner — a friendly "from" name, your verified address.
    transporter.sendMail({
      from: `"Portfolio Contact" <${fromAddress}>`,
      to: notifyAddress,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `<h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>`
    }).catch(err => console.error('Owner notification email failed:', err.message));

    // Auto-reply confirmation to the visitor — a polished, branded message.
    const safeName = String(name).replace(/[<>]/g, '');
    const autoReplyHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style="margin:0; padding:0; background:#050507; font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#050507; padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#111118; border:1px solid #1c1c28; border-radius:16px; overflow:hidden;">
                <!-- Header -->
                <tr>
                  <td style="padding:32px 36px 24px; border-bottom:1px solid #1c1c28;">
                    <span style="font-size:26px; font-weight:800; color:#f2f2ff; letter-spacing:-0.02em;">Fahad<span style="color:#00ffaa;">.</span></span>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:32px 36px;">
                    <h1 style="margin:0 0 16px; font-size:22px; color:#f2f2ff; font-weight:700;">Thanks for reaching out, ${safeName}!</h1>
                    <p style="margin:0 0 18px; font-size:15px; line-height:1.7; color:#8a8aaa;">
                      I've received your message and I'll get back to you personally within 24&ndash;48 hours.
                      In the meantime, feel free to explore my work or connect with me below.
                    </p>
                    <!-- Echoed message -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c10; border:1px solid #1c1c28; border-radius:12px; margin:8px 0 24px;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <p style="margin:0 0 6px; font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:#44445a;">Your message</p>
                          <p style="margin:0 0 4px; font-size:13px; color:#8a8aaa;"><strong style="color:#f2f2ff;">Subject:</strong> ${String(subject).replace(/[<>]/g, '')}</p>
                          <p style="margin:0; font-size:14px; line-height:1.6; color:#c8c8dc;">${String(message).replace(/[<>]/g, '').replace(/\n/g, '<br>')}</p>
                        </td>
                      </tr>
                    </table>
                    <!-- CTA -->
                    <a href="https://fahad-ali.dev/projects" style="display:inline-block; background:#00ffaa; color:#000; font-size:14px; font-weight:600; text-decoration:none; padding:12px 26px; border-radius:9999px;">
                      View My Work
                    </a>
                    <!-- Links -->
                    <p style="margin:28px 0 0; font-size:13px; line-height:1.8; color:#8a8aaa;">
                      <a href="https://www.linkedin.com/in/fahadali-fullstack-dev" style="color:#00ffaa; text-decoration:none;">LinkedIn</a>&nbsp;&nbsp;·&nbsp;&nbsp;
                      <a href="https://github.com/fahadali0077" style="color:#00ffaa; text-decoration:none;">GitHub</a>&nbsp;&nbsp;·&nbsp;&nbsp;
                      <a href="https://fahad-ali.dev" style="color:#00ffaa; text-decoration:none;">Portfolio</a>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:20px 36px; border-top:1px solid #1c1c28;">
                    <p style="margin:0; font-size:13px; color:#f2f2ff;">Best regards,<br><strong>Fahad Ali</strong> &mdash; Full-Stack Developer</p>
                    <p style="margin:10px 0 0; font-size:11px; color:#44445a;">This is an automated confirmation. You can simply reply to this email to reach me directly.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>`;

    transporter.sendMail({
      from: `"Fahad Ali" <${fromAddress}>`,
      to: email,
      replyTo: notifyAddress, // visitor's reply comes back to your inbox
      subject: 'Thanks for reaching out — Fahad Ali',
      html: autoReplyHtml
    }).catch(err => console.error('Auto-reply email failed:', err.message));

  } catch (error) {
    console.error('Contact submission error:', error);
    // Only respond with an error if we haven't already sent a response.
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Failed to send message. Please try again later.'
      });
    }
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
