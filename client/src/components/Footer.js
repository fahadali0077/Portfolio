import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaLinkedin, url: 'https://www.linkedin.com/in/fahad-ali-840a093a8', label: 'LinkedIn' },
    { icon: FaGithub, url: 'https://github.com/fahadali0077', label: 'GitHub' },
    { icon: FaEnvelope, url: 'mailto:fahadj698@gmail.com', label: 'Email' },
    { icon: FaPhone, url: 'tel:+923099639354', label: 'Phone' }
  ];

  const footerLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              Fahad<span className="accent-dot">.</span>
            </h3>
            <p className="footer-tagline">
              Building digital experiences with the MERN stack
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links">
              {footerLinks.map((link) => (
                <Link key={link.path} to={link.path} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Connect</h4>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <social.icon size={22} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Fahad Ali. All rights reserved.
          </p>
          <p className="footer-built">
            Built with <span className="heart">❤</span> using MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
