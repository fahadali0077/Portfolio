import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FaGithub, FaArrowRight, FaCode, FaDatabase, FaTools } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState({});
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    fetchFeaturedProjects();
    fetchSkills();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await axios.get('/api/projects/featured');
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills');
      setSkills(response.data.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero section">
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="hero-text">
              <motion.p
                className="hero-greeting"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Hi, I'm
              </motion.p>

              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Fahad Ali
                <span className="title-dot">.</span>
              </motion.h1>

              <div className="hero-subtitle">
                <TypeAnimation
                  sequence={[
                    'Full-Stack Developer',
                    2000,
                    'MERN Stack Specialist',
                    2000,
                    'Web Developer',
                    2000,
                  ]}
                  wrapper="h2"
                  speed={50}
                  repeat={Infinity}
                />
              </div>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                I build scalable, high-performance web applications using the MERN stack.
                Passionate about creating seamless user experiences and writing clean,
                maintainable code.
              </motion.p>

              <motion.div
                className="hero-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Link to="/projects" className="btn btn-primary">
                  View My Work <FaArrowRight />
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Get In Touch
                </Link>
              </motion.div>
            </div>

            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <div className="code-window">
                <div className="window-header">
                  <div className="window-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="window-title">portfolio.js</span>
                </div>
                <div className="window-content">
                  <pre className="code">
                    {`const developer = {
  name: "Fahad Ali",
  role: "Full-Stack Developer",
  stack: ["MongoDB", "Express", 
          "React", "Node.js"],
  passion: "Building Amazing Apps",
  available: true
};`}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="about section" ref={ref}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">About Me</h2>

            <div className="about-content">
              <div className="about-text">
                <p>
                  I'm a Computer Science student at the University of Engineering and
                  Technology, Lahore, specializing in full-stack web development with
                  the MERN stack.
                </p>
                <p>
                  My journey in web development started with a curiosity about how
                  websites work, and it quickly turned into a passion for building
                  complete, scalable applications from scratch.
                </p>
                <p>
                  I focus on writing clean, efficient code and creating intuitive user
                  interfaces. Whether it's designing a responsive frontend or architecting
                  a robust backend, I bring dedication and attention to detail to every
                  project.
                </p>
              </div>

              <div className="about-stats">
                <div className="stat-card">
                  <h3 className="stat-number gradient-text">10+</h3>
                  <p className="stat-label">Projects Completed</p>
                </div>
                <div className="stat-card">
                  <h3 className="stat-number gradient-text">2+</h3>
                  <p className="stat-label">Years Experience</p>
                </div>
                <div className="stat-card">
                  <h3 className="stat-number gradient-text">100%</h3>
                  <p className="stat-label">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills section">
        <div className="container">
          <h2 className="section-title">Technical Skills</h2>

          <div className="skills-grid">
            {Object.keys(skills).length > 0 && (
              <>
                <SkillCategory
                  title="Frontend"
                  icon={<FaCode />}
                  skills={skills.Frontend || []}
                />
                <SkillCategory
                  title="Backend"
                  icon={<FaDatabase />}
                  skills={skills.Backend || []}
                />
                <SkillCategory
                  title="Tools & Others"
                  icon={<FaTools />}
                  skills={[...(skills.Tools || []), ...(skills.Database || [])]}
                />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Projects</h2>
            <Link to="/projects" className="view-all-link">
              View All Projects <FaArrowRight />
            </Link>
          </div>

          <div className="projects-grid grid grid-3">
            {projects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// Skill Category Component
const SkillCategory = ({ title, icon, skills }) => {
  return (
    <motion.div
      className="skill-category card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
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
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="skill-name">{skill.name}</span>
            <div className="skill-bar">
              <motion.div
                className="skill-progress"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.proficiency}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Project Card Component
const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      className="project-card card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="project-image">
        <img src={project.imageUrl} alt={project.title} />
        <div className="project-overlay">
          <div className="project-links">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn"
              >
                <FaGithub size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-btn"
              >
                <FaArrowRight size={20} />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="project-info">
        <span className="project-category">{project.category}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>

        <div className="project-tech">
          {project.technologies.slice(0, 3).map((tech, i) => (
            <span key={i} className="tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
