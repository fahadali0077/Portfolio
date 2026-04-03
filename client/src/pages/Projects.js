import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    } catch (error) {
      console.error('Error fetching projects:', error);
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
      setFilteredProjects(projects.filter(project => project.category === category));
    }
  };

  return (
    <div className="projects-page">
      <section className="projects-header section">
        <div className="container">
          <motion.div className="header-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="page-title">My Projects<span className="title-dot">.</span></h1>
            <p className="page-description">
              A collection of web applications I've built using the MERN stack and other modern technologies.
              Each project showcases different aspects of full-stack development.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="projects-content section">
        <div className="container">
          <motion.div className="filter-bar" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="filter-label">
              <FaFilter />
              <span>Filter by:</span>
            </div>
            <div className="filter-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                  onClick={() => filterProjects(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="projects-grid grid grid-2">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project._id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <p>No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div className="project-detail-card card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <div className="project-header">
        <div className="project-image">
          {project.imageUrl && <img src={project.imageUrl} alt={project.title} />}
          <div className="image-overlay"></div>
        </div>
        <span className="project-badge">{project.category}</span>
      </div>

      <div className="project-body">
        <h3 className="project-name">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {project.features && project.features.length > 0 && (
          <div className="project-features">
            <h4>Key Features:</h4>
            <ul>
              {project.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="project-technologies">
          <h4>Technologies:</h4>
          <div className="tech-list">
            {(project.technologies || []).map((tech, i) => (
              <span key={i} className="tech-badge">{tech}</span>
            ))}
          </div>
        </div>

        <div className="project-actions">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <FaGithub /> GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
