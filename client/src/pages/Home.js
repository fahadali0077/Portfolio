import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaGithub, FaArrowRight, FaCode, FaDatabase, FaTools, FaExternalLinkAlt } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import './Home.css';

const API_URL = process.env.REACT_APP_API_URL || '';

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

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    Promise.all([fetchFeaturedProjects(), fetchSkills()]).finally(() => setLoading(false));
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/projects/featured`);
      setProjects(response.data.data || []);
    } catch {
      setProjects([]);
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
                // hello, world 👋
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
                <Link to="/projects" className="btn btn-primary">
                  View My Work <FaArrowRight />
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Get In Touch
                </Link>
              </motion.div>

              <motion.div className="hero-stats" variants={itemVariants}>
                {[
                  { num: '3+', lbl: 'Projects' },
                  { num: '2+', lbl: 'Yrs Exp' },
                  { num: '100%', lbl: 'Dedication' },
                ].map((s) => (
                  <div className="hero-stat" key={s.lbl}>
                    <span className="stat-num">{s.num}</span>
                    <span className="stat-lbl">{s.lbl}</span>
                  </div>
                ))}
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

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
          SCROLL
        </div>
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
            <p className="section-label">About Me</p>
            <h2 className="section-title">
              The Mind<br />Behind The Code
            </h2>
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
              <div className="about-tags">
                {['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Git', 'REST APIs', 'Responsive Design'].map(tag => (
                  <motion.span
                    key={tag}
                    className="about-tag"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <div className="about-sidebar">
              {[
                { num: '3+', label: 'Projects Completed' },
                { num: '2+', label: 'Years Experience' },
                { num: '100%', label: 'Client Satisfaction' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="stat-number">{stat.num}</h3>
                  <p className="stat-label">{stat.label}</p>
                </motion.div>
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
            <p className="section-label">What I Know</p>
            <h2 className="section-title">Technical Skills</h2>
          </motion.div>

          <div className="skills-grid">
            {skills && Object.keys(skills).length > 0 && (
              <>
                <SkillCategory title="Frontend" icon={<FaCode />} skills={skills.Frontend || []} inView={skillsInView} delay={0} />
                <SkillCategory title="Backend" icon={<FaDatabase />} skills={skills.Backend || []} inView={skillsInView} delay={0.1} />
                <SkillCategory title="Tools & Database" icon={<FaTools />} skills={[...(skills.Tools || []), ...(skills.Database || [])]} inView={skillsInView} delay={0.2} />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      {!loading && projects.length > 0 && (
        <section className="featured-projects section">
          <div className="container">
            <div className="section-header">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p className="section-label">Portfolio</p>
                <h2 className="section-title">Featured Projects</h2>
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
    <motion.div
      className="skill-category card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      <div className="skill-category-header">
        <div className="skill-icon">{icon}</div>
        <h3>{title}</h3>
      </div>
      <div className="skill-list">
        {skills.map((skill, index) => (
          <motion.div
            key={skill._id}
            className="skill-item"
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: delay + index * 0.08 + 0.3 }}
          >
            <div className="skill-header">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-pct">{skill.proficiency}%</span>
            </div>
            <div className="skill-bar">
              <motion.div
                className="skill-progress"
                initial={{ width: 0 }}
                animate={inView ? { width: `${skill.proficiency}%` } : {}}
                transition={{ duration: 1.2, delay: delay + index * 0.08 + 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const ProjectCard = ({ project, index }) => (
  <motion.div
    className="project-card card"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12, duration: 0.6 }}
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
      <span className="project-category">{project.category}</span>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tech">
        {(project.technologies || []).slice(0, 3).map((tech, i) => (
          <span key={i} className="tech-tag">{tech}</span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default Home;
