import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin } from 'react-icons/fa';
import axios from 'axios';
import './Contact.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_URL}/api/contact`, formData);
      if (response.data.success) {
        setStatus({ type: 'success', message: response.data.message });
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FaEnvelope, label: 'Email', value: 'fahadj698@gmail.com', link: 'mailto:fahadj698@gmail.com' },
    { icon: FaPhone, label: 'Phone', value: '+92-309-9639354', link: 'tel:+923099639354' },
    { icon: FaMapMarkerAlt, label: 'Location', value: 'Lahore, Pakistan', link: null }
  ];

  const socialLinks = [
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/fahad-ali-840a093a8', label: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com/fahadali0077', label: 'GitHub' }
  ];

  return (
    <div className="contact-page">
      <section className="contact-header section">
        <div className="container">
          <motion.div className="header-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="page-title">Get In Touch<span className="title-dot">.</span></h1>
            <p className="page-description">
              Have a project in mind or want to collaborate? I'd love to hear from you.
              Fill out the form below and I'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="contact-content section">
        <div className="container">
          <div className="contact-grid">
            <motion.div className="contact-info" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <h2>Contact Information</h2>
              <p className="info-description">Let's discuss your next project or opportunity.</p>

              <div className="info-cards">
                {contactInfo.map((info, index) => (
                  <motion.div key={info.label} className="info-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                    <div className="info-icon"><info.icon /></div>
                    <div className="info-content">
                      <h4>{info.label}</h4>
                      {info.link ? <a href={info.link}>{info.value}</a> : <p>{info.value}</p>}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="social-section">
                <h3>Follow Me</h3>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      aria-label={social.label}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <social.icon size={22} style={{ color: 'inherit', display: 'block' }} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div className="contact-form-container" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <form onSubmit={handleSubmit} className="contact-form card">
                <h2>Send Me a Message</h2>

                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className="form-input" />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Your Email *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="form-input" />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Project Inquiry" className="form-input" />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Your Message *</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="6" placeholder="Tell me about your project..." className="form-input" />
                </div>

                {status.message && (
                  <motion.div className={`status-message ${status.type}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    {status.message}
                  </motion.div>
                )}

                <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
