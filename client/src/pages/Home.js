import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaGithub, FaArrowRight, FaCode, FaDatabase, FaTools, FaServer, FaVial, FaExternalLinkAlt } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import { Magnetic, CountUp, Spotlight } from '../components/Effects';
import TechMarquee from '../components/TechMarquee';
import ParticleField from '../components/ParticleField';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || '';

// Static fallback so the page is never empty if the API is cold/down
// (Render free tier cold-starts can take 30s+ or fail on first hit).
const FALLBACK_PROJECTS = [
  {
    _id: 'fb-skillseal',
    title: 'SkillSeal — AI Skill Verification Platform',
    description:
      'An AI-powered skill verification SaaS with a proctored assessment engine, anti-cheat monitoring, cryptographic certificates, and a recruiter dashboard.',
    technologies: ['React', 'TypeScript', 'Node.js'],
    githubUrl: 'https://github.com/fahadali0077/SkillSeal',
    liveUrl: 'https://skillseal.tech',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    category: ['AI/ML', 'Full-Stack'],
  },
  {
    _id: 'fb-mernshop',
    title: 'MERNShop — E-Commerce Storefront',
    description:
      'A polished, fully deployed e-commerce frontend built across nine modules — catalog, cart, checkout, account pages, and an admin dashboard.',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS'],
    githubUrl: 'https://github.com/fahadali0077/MERNShop',
    liveUrl: 'https://mern-shop-swart.vercel.app/',
    imageUrl: '/mernshop.png',
    category: ['Full-Stack'],
  },
  {
    _id: 'fb-earlywrite',
    title: 'EarlyWrite — Dysgraphia Detection',
    description:
      "An AI-powered bilingual platform that detects dysgraphia indicators in children's handwriting, supporting English and Urdu with real-time diagnostic feedback.",
    technologies: ['React', 'Python', 'TensorFlow'],
    githubUrl: null,
    liveUrl: 'https://earlywrite.vercel.app/',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    category: ['AI/ML', 'Frontend'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [skillsRef, skillsInView] = useInView({ threshold: 0.05, triggerOnce: true });
  const [featuredRef, featuredInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  // Fade only once the hero is genuinely scrolling away, so it doesn't
  // disappear while still partly on-screen on laptop-height viewports.
  const heroOpacity = useTransform(scrollY, [0, 550], [1, 0]);

  useEffect(() => {
    Promise.all([fetchFeaturedProjects(), fetchSkills()]).finally(() => setLoading(false));
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/featured`);
      const data = response.data.data || [];
      // If the API responds but returns nothing, still show the fallback.
      setProjects(data.length > 0 ? data : FALLBACK_PROJECTS);
    } catch {
      // API down / cold-starting — show static fallback instead of an empty page.
      setProjects(FALLBACK_PROJECTS);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/skills`);
      setSkills(response.data.data || {});
    } catch {
      setSkills({});
    }
  };

  const codeLines = [
    { num: 1, content: <><span className="keyword">const</span> <span className="key">developer</span> = {'{'}</> },
    { num: 2, content: <>&nbsp;&nbsp;<span className="key">name</span>: <span className="string">"Fahad Ali"</span>,</> },
    { num: 3, content: <>&nbsp;&nbsp;<span className="key">role</span>: <span className="string">"Full-Stack Developer"</span>,</> },
    { num: 4, content: <>&nbsp;&nbsp;<span className="key">stack</span>: <span className="bracket">[</span><span className="string">"MongoDB"</span>, <span className="string">"Express"</span>,</> },
    { num: 5, content: <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="string">"React"</span>, <span className="string">"Node.js"</span><span className="bracket">]</span>,</> },
    { num: 6, content: <>&nbsp;&nbsp;<span className="key">passion</span>: <span className="string">"Building Amazing Apps"</span>,</> },
    { num: 7, content: <>&nbsp;&nbsp;<span className="key">available</span>: <span className="bool">true</span></> },
    { num: 8, content: <>{'};'}</> },
  ];

  return (
    <div className="home">
      {/* ===== HERO ===== */}
      <section className="hero section">
        <ParticleField />
        <motion.div
          className="container"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left: Text */}
            <div className="hero-text">
              <motion.div variants={itemVariants} className="hero-badge">
                <span className="badge-dot" />
                Available for opportunities
              </motion.div>

              <motion.p className="hero-greeting" variants={itemVariants}>
                hello, world 👋
              </motion.p>

              <motion.h1 className="hero-title" variants={itemVariants}>
                <span className="title-line">Fahad</span>
                <span className="title-line">Ali<span className="title-dot">.</span></span>
              </motion.h1>

              <motion.div className="hero-subtitle" variants={itemVariants}>
                <TypeAnimation
                  sequence={[
                    'Full-Stack Developer', 2000,
                    'MERN Stack Specialist', 2000,
                    'Problem Solver', 2000,
                    'Web Developer', 2000,
                  ]}
                  wrapper="h2"
                  speed={50}
                  repeat={Infinity}
                />
              </motion.div>

              <motion.p className="hero-description" variants={itemVariants}>
                I craft scalable, high-performance web applications using the MERN stack.
                Passionate about clean code, seamless UX, and turning ideas into reality.
              </motion.p>

              <motion.div className="hero-cta" variants={itemVariants}>
                <Magnetic strength={0.4}>
                  <Link to="/projects" className="btn btn-primary">
                    View My Work <FaArrowRight />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <Link to="/contact" className="btn btn-outline">
                    Get In Touch
                  </Link>
                </Magnetic>
              </motion.div>
            </div>

            {/* Right: Code Window */}
            <motion.div
              className="hero-visual"
              variants={itemVariants}
            >
              <div className="hero-visual-wrapper">
                {/* Decorative rings */}
                <div className="deco-ring deco-ring-1" />
                <div className="deco-ring deco-ring-2" />

                {/* Floating badges */}
                <motion.div
                  className="floating-badge fb-top"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <FaCode className="fb-icon" />
                  MERN Stack Expert
                </motion.div>

                <motion.div
                  className="floating-badge fb-bottom"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <HiOutlineLocationMarker className="fb-icon" />
                  Lahore, Pakistan
                </motion.div>

                {/* Code Window */}
                <motion.div
                  className="code-window"
                  whileHover={{ y: -8, boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 40px rgba(0,255,170,0.15)' }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="window-header">
                    <div className="window-dots">
                      <span className="dot red" />
                      <span className="dot yellow" />
                      <span className="dot green" />
                    </div>
                    <span className="window-title">portfolio.js</span>
                  </div>
                  <div className="window-content">
                    {codeLines.map((line, i) => (
                      <motion.div
                        key={line.num}
                        className="code-line"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.08 }}
                      >
                        <span className="line-num">{line.num}</span>
                        <span className="line-code">{line.content}</span>
                      </motion.div>
                    ))}
                    <div className="code-line" style={{ marginTop: '4px' }}>
                      <span className="line-num">&nbsp;</span>
                      <span className="typing-cursor" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated scroll-down cue */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          aria-hidden="true"
        >
          <span className="scroll-indicator-text">scroll</span>
          <div className="scroll-mouse">
            <motion.div
              className="scroll-wheel"
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ===== TECH MARQUEE ===== */}
      <section className="marquee-section" aria-label="Technology stack">
        <div className="container">
          <p className="marquee-caption">My toolkit</p>
        </div>
        <TechMarquee />
      </section>

      {/* ===== ABOUT ===== */}
      <section className="about section" ref={aboutRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 40, skewY: 2 }}
              animate={aboutInView ? { opacity: 1, y: 0, skewY: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            >
              The Mind<br />Behind The Code
            </motion.h2>
          </motion.div>

          <div className="about-content">
            <motion.div
              className="about-text"
              initial={{ opacity: 0, x: -30 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <p>
                I'm a Computer Science student at the University of Engineering and Technology, Lahore,
                specializing in full-stack web development with the MERN stack.
              </p>
              <p>
                My journey in web development started with a curiosity about how websites work, and it
                quickly turned into a passion for building complete, scalable applications from scratch.
              </p>
              <p>
                I focus on writing clean, efficient code and creating intuitive user interfaces. Whether it's
                designing a responsive frontend or architecting a robust backend, I bring dedication and
                attention to detail to every project.
              </p>
            </motion.div>

            <div className="about-sidebar">
              {[
                { num: '6+', label: 'Projects Built' },
                { num: '15+', label: 'Technologies' },
                { num: '4', label: 'Live Deployments' },
              ].map((stat, i) => (
                <Spotlight
                  as={motion.div}
                  key={stat.label}
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="stat-number"><CountUp value={stat.num} /></h3>
                  <p className="stat-label">{stat.label}</p>
                </Spotlight>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKILLS ===== */}
      <section className="skills-section section" ref={skillsRef}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 40, skewY: 2 }}
              animate={skillsInView ? { opacity: 1, y: 0, skewY: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            >
              Technical Skills
            </motion.h2>
          </motion.div>

          <div className="skills-grid">
            {skills && Object.keys(skills).length > 0 && (
              <>
                <SkillCategory title="Frontend" icon={<FaCode />} skills={skills.Frontend || []} inView={skillsInView} delay={0} />
                <SkillCategory title="Backend" icon={<FaServer />} skills={skills.Backend || []} inView={skillsInView} delay={0.1} />
                <SkillCategory title="Database" icon={<FaDatabase />} skills={skills.Database || []} inView={skillsInView} delay={0.2} />
                <SkillCategory title="Tools" icon={<FaTools />} skills={skills.Tools || []} inView={skillsInView} delay={0.3} />
                <SkillCategory title="Testing" icon={<FaVial />} skills={skills.Testing || []} inView={skillsInView} delay={0.4} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      {!loading && projects.length > 0 && (
        <section className="featured-projects section" ref={featuredRef}>
          <div className="container">
            <div className="section-header">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <motion.h2
                  className="section-title"
                  initial={{ opacity: 0, y: 40, skewY: 2 }}
                  animate={featuredInView ? { opacity: 1, y: 0, skewY: 0 } : {}}
                  transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                >
                  Featured Projects
                </motion.h2>
              </div>
              <Link to="/projects" className="view-all-link">
                View All <FaArrowRight />
              </Link>
            </div>
            <div className="projects-grid grid grid-3">
              {projects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const SkillCategory = ({ title, icon, skills, inView, delay }) => {
  if (!skills || skills.length === 0) return null;
  return (
    <Spotlight
      as={motion.div}
      className="skill-category card"
      initial={{ opacity: 0, y: 40, scale: 0.96, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="skill-category-header">
        <motion.div
          className="skill-icon"
          initial={{ scale: 0, rotate: -45 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: delay + 0.15, type: 'spring', stiffness: 220, damping: 14 }}
        >
          {icon}
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: delay + 0.25 }}
        >
          {title}
        </motion.h3>
      </div>
      <div className="skill-list">
        {skills.map((skill, index) => {
          const itemDelay = delay + index * 0.1 + 0.3;
          return (
            <motion.div
              key={skill._id}
              className="skill-item"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: itemDelay }}
            >
              <div className="skill-header">
                <span className="skill-name">{skill.name}</span>
                <span className="skill-pct">
                  <CountUp value={`${skill.proficiency}%`} duration={1.2} />
                </span>
              </div>
              <div className="skill-bar">
                <motion.div
                  className="skill-progress"
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.proficiency}%` } : {}}
                  transition={{ duration: 1.2, delay: itemDelay + 0.1, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Spotlight>
  );
};

const ProjectCard = ({ project, index }) => (
  <Spotlight
    as={motion.div}
    className="project-card card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12, duration: 0.6 }}
    whileHover={{ y: -8 }}
  >
    <div className="project-image">
      {project.imageUrl
        ? <img src={project.imageUrl} alt={project.title} />
        : <div className="project-image-placeholder">[ {project.title} ]</div>
      }
      <div className="project-overlay">
        <div className="project-links">
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub size={18} />
            </motion.a>
          )}
          {project.liveUrl && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaExternalLinkAlt size={16} />
            </motion.a>
          )}
        </div>
      </div>
    </div>
    <div className="project-info">
      <span className="project-category">{(Array.isArray(project.category) ? project.category : [project.category]).filter(Boolean).join(' · ')}</span>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tech">
        {(project.technologies || []).slice(0, 3).map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>
    </div>
  </Spotlight>
);

export default Home;