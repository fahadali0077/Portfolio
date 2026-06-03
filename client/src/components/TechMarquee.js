import React from 'react';
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs,
  SiExpress, SiMongodb, SiTailwindcss, SiRedis, SiPostgresql,
  SiDocker, SiGit, SiFramer, SiVite,
} from 'react-icons/si';
import './TechMarquee.css';

const TECH = [
  { icon: SiReact, name: 'React' },
  { icon: SiNextdotjs, name: 'Next.js' },
  { icon: SiTypescript, name: 'TypeScript' },
  { icon: SiJavascript, name: 'JavaScript' },
  { icon: SiNodedotjs, name: 'Node.js' },
  { icon: SiExpress, name: 'Express' },
  { icon: SiMongodb, name: 'MongoDB' },
  { icon: SiTailwindcss, name: 'Tailwind' },
  { icon: SiRedis, name: 'Redis' },
  { icon: SiPostgresql, name: 'PostgreSQL' },
  { icon: SiDocker, name: 'Docker' },
  { icon: SiGit, name: 'Git' },
  { icon: SiFramer, name: 'Framer Motion' },
  { icon: SiVite, name: 'Vite' },
];

const Row = () => (
  <div className="marquee-row" aria-hidden="true">
    {TECH.map(({ icon: Icon, name }) => (
      <span className="marquee-item" key={name}>
        <Icon className="marquee-icon" />
        {name}
      </span>
    ))}
  </div>
);

const TechMarquee = () => (
  <div className="tech-marquee" role="img" aria-label="Technologies I work with">
    <div className="marquee-track">
      <Row />
      <Row />
    </div>
    <div className="marquee-fade marquee-fade-left" />
    <div className="marquee-fade marquee-fade-right" />
  </div>
);

export default TechMarquee;
