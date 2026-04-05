import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaCheckCircle, FaExclamationCircle, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import './Contact.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const validate = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = 'Name is required';
  else if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!formData.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email';
  if (!formData.subject.trim()) errors.subject = 'Subject is required';
  else if (formData.subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters';
  if (!formData.message.trim()) errors.message = 'Message is required';
  else if (formData.message.trim().length < 10) errors.message = `${10 - formData.message.trim().length} more characters needed`;
  return errors;
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...formData, [name]: value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, subject: true, message: true };
    setTouched(allTouched);
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const response = await axios.post(`${API_URL}/api/contact`, formData, { timeout: 30000 });
      if (response.data && response.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTouched({});
        setErrors({});
        // Scroll the form into view so user sees success message immediately
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.code === 'ECONNABORTED'
          ? 'Request timed out. Please try again.'
          : error.response?.data?.message || 'Failed to send. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getFieldState = (name) => {
    if (!touched[name]) return 'idle';
    if (errors[name]) return 'error';
    if (formData[name]) return 'success';
    return 'idle';
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

  const inputVariants = {
    idle: { borderColor: 'var(--color-border)' },
    error: { borderColor: '#ff4466', boxShadow: '0 0 0 3px rgba(255,68,102,0.1)' },
    success: { borderColor: 'var(--color-accent)', boxShadow: '0 0 0 3px rgba(0,255,170,0.08)' }
  };

  const fields = [
    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Your Email', type: 'email', placeholder: 'john@example.com' },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Project Inquiry' },
  ];

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.p
              className="section-label"
              style={{ justifyContent: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Let's Talk
            </motion.p>
            <h1 className="page-title">
              Get In Touch<span className="title-dot">.</span>
            </h1>
            <p className="page-description">
              Have a project in mind or want to collaborate? I'd love to hear from you.
              Fill out the form and I'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <div className="container">
        <div className="contact-grid">

          {/* Left: Info */}
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div>
              <h2>Contact Information</h2>
              <p className="info-description">Let's discuss your next project or opportunity.</p>
            </div>

            <div className="info-cards">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={info.label}
                  className="info-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1 }}
                  whileHover={{ x: 8 }}
                >
                  <motion.div
                    className="info-icon"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <info.icon />
                  </motion.div>
                  <div className="info-content">
                    <h4>{info.label}</h4>
                    {info.link
                      ? <a href={info.link}>{info.value}</a>
                      : <p>{info.value}</p>
                    }
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="social-section">
              <h3>Follow Me</h3>
              <div className="social-links">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    aria-label={social.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.12, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="contact-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="success-screen card"
                  initial={{ opacity: 0, scale: 0.85, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <motion.div
                    className="success-icon-wrap"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
                  >
                    <motion.div
                      className="success-icon"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    >
                      <FaCheckCircle />
                    </motion.div>
                  </motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
                    Message Sent!
                  </motion.h2>
                  <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
                    Thanks for reaching out. I'll get back to you as soon as possible.
                  </motion.p>
                  <motion.p
                    className="success-timer-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    This message will close in 5s
                  </motion.p>
                  <motion.div
                    className="success-bar"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="contact-form card"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  noValidate
                >
                  <h2>Send a Message</h2>

                  {/* Regular fields */}
                  {fields.map(({ name, label, type, placeholder }) => (
                    <div className="form-group" key={name}>
                      <label htmlFor={name}>{label} *</label>
                      <div className="input-wrapper">
                        <motion.input
                          type={type}
                          id={name}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={placeholder}
                          className={`form-input ${getFieldState(name)}`}
                          animate={inputVariants[getFieldState(name)]}
                          transition={{ duration: 0.2 }}
                        />
                        <AnimatePresence>
                          {getFieldState(name) === 'success' && (
                            <motion.span className="field-icon success-icon-sm" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                              <FaCheckCircle />
                            </motion.span>
                          )}
                          {getFieldState(name) === 'error' && (
                            <motion.span className="field-icon error-icon-sm" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                              <FaExclamationCircle />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                      <AnimatePresence>
                        {errors[name] && touched[name] && (
                          <motion.span
                            className="field-error"
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FaExclamationCircle /> {errors[name]}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}

                  {/* Message */}
                  <div className="form-group">
                    <label htmlFor="message">Your Message *</label>
                    <div className="input-wrapper textarea-wrapper">
                      <motion.textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows="5"
                        placeholder="Tell me about your project..."
                        className={`form-input ${getFieldState('message')}`}
                        animate={inputVariants[getFieldState('message')]}
                        transition={{ duration: 0.2 }}
                        maxLength={2000}
                      />
                    </div>
                    <div className="message-footer">
                      <AnimatePresence>
                        {errors.message && touched.message && (
                          <motion.span
                            className="field-error inline"
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                          >
                            <FaExclamationCircle /> {errors.message}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <motion.span
                        className="char-counter"
                        animate={{ color: formData.message.length < 10 && formData.message.length > 0 ? '#ff4466' : formData.message.length >= 10 ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
                      >
                        {formData.message.length} / 2000
                      </motion.span>
                    </div>
                  </div>

                  <AnimatePresence>
                    {status.message && (
                      <motion.div
                        className={`status-message ${status.type}`}
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                      >
                        {status.message}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    className="btn btn-primary submit-btn"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                  >
                    <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.span key="loading" className="btn-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <span className="spinner-dot" />
                          <span className="spinner-dot" />
                          <span className="spinner-dot" />
                        </motion.span>
                      ) : (
                        <motion.span key="send" className="btn-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Send Message <FaPaperPlane style={{ marginLeft: '6px' }} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
