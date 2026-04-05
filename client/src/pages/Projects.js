import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import './Projects.css';

const API_URL = process.env.REACT_APP_API_URL || '';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Full-Stack', 'Frontend', 'Backend', 'AI,ML'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/projects`);
      const data = response.data.data || [];
      setProjects(data);
      setFilteredProjects(data);
    } catch {
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = (category) => {
    setActiveFilter(category);
    if (category === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.category === category));
    }
  };

  return (
    <div className="projects-page">
      {/* Page Header */}
      <section className="projects-hero section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
          >

            <h1 className="page-title">
              My Projects<span className="title-dot">.</span>
            </h1>
            <p className="page-description">
              A collection of web applications I've built using the MERN stack and other modern technologies.
              Each project showcases different aspects of full-stack development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Content */}
      <section className="projects-content-section">
        <div className="container">
          {/* Filter Bar */}
          <motion.div
            className="filter-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="filter-label">
              <FaFilter />
              <span>Filter</span>
            </div>
            <div className="filter-buttons">
              {categories.map((category, i) => (
                <motion.button
                  key={category}
                  className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                  onClick={() => filterProjects(category)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
            {!loading && (
              <span className="projects-count">
                {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
              </span>
            )}
          </motion.div>

          {/* Project Cards */}
          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <AnimatePresence mode="popLayout">
              <motion.div className="projects-grid grid grid-2" layout>
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project._id} project={project} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              className="no-projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p>No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

const ProjectCard = ({ project, index }) => (
  <motion.div
    className="project-detail-card card"
    layout
    initial={{ opacity: 0, y: 30, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -20, scale: 0.97 }}
    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -6 }}
  >
    <div className="project-header">
      <div className="project-image">
        {project.imageUrl
          ? <img src={project.imageUrl} alt={project.title} />
          : <div className="project-image-no-img">[ {project.title} ]</div>
        }
        <div className="image-overlay" />
      </div>
      <span className="project-badge">{project.category}</span>
    </div>

    <div className="project-body">
      <h3 className="project-name">{project.title}</h3>
      <p className="project-desc">{project.description}</p>

      {project.features && project.features.length > 0 && (
        <div className="project-features">
          <h4>Key Features</h4>
          <ul>
            {project.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="project-technologies">
        <h4>Stack</h4>
        <div className="tech-list">
          {(project.technologies || []).map((tech, i) => (
            <motion.span
              key={i}
              className="tech-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="project-actions">
        {project.githubUrl && (
          <motion.a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaGithub /> GitHub
          </motion.a>
        )}
        {project.liveUrl && (
          <motion.a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FaExternalLinkAlt /> Live Demo
          </motion.a>
        )}
      </div>
    </div>
  </motion.div>
);

export default Projects;
