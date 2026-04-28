const mongoose = require('mongoose');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ MongoDB connected');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

const projects = [
  {
    title: 'School Management System',
    description:
      'A full-stack MERN platform for schools — covering student registration, teacher assignments, class scheduling, and role-based admin dashboards.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Redux'],
    features: [
      'JWT authentication with role-based access control',
      'Student & teacher profiles with full CRUD operations',
      'Class scheduling and assignment tracking',
      'Responsive design for mobile and desktop',
      'RESTful API with robust error handling',
    ],
    githubUrl: 'https://github.com/Fahad-Ali/MERN-School-Management-System',
    liveUrl: 'https://www.school-management-system.me/',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    category: 'Full-Stack',
    featured: true,
    order: 1,
  },
  {
    title: 'MERN Shop — E-Commerce',
    description:
      'A React-based e-commerce storefront with a complete, polished UI — product catalog, cart, and checkout flow. Backend integration is currently in progress.',
    technologies: ['React', 'Redux', 'CSS', 'JavaScript'],
    features: [
      'Fully functional product catalog with filtering',
      'Cart and checkout UI flow',
      'Responsive storefront for all screen sizes',
      'State management with Redux',
      'Backend (Node.js / Express / MongoDB) in active development',
    ],
    githubUrl: 'https://github.com/Fahad-Ali/MERN-Shop',
    liveUrl: 'https://mern-shop-swart.vercel.app/',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    category: 'Frontend',
    featured: true,
    order: 2,
  },
  {
    title: 'EarlyWrite — Dysgraphia Detection',
    description:
      'An AI-powered bilingual web platform that detects dysgraphia indicators in children\'s handwriting. Supports both English and Urdu, with word-level and sentence-level analysis modules delivering diagnostic feedback in real time.',
    technologies: ['React', 'Node.js', 'Python', 'TensorFlow', 'MongoDB', 'AWS'],
    features: [
      'Bilingual support for English and Urdu handwriting analysis',
      'Word-level and sentence-level diagnostic modules',
      'Deep learning models for pattern recognition',
      'Modular web interface with language & analysis-level selection',
      'Results delivered within 30 seconds per analysis',
    ],
    githubUrl: null,
    liveUrl: 'https://earlywrite.vercel.app/',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    category: 'AI,ML',
    featured: true,
    order: 3,
  },

];

const skills = [
  // Frontend
  { name: 'React.js', category: 'Frontend', proficiency: 90, order: 1 },
  { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 90, order: 2 },
  { name: 'HTML5', category: 'Frontend', proficiency: 95, order: 3 },
  { name: 'CSS3', category: 'Frontend', proficiency: 90, order: 4 },
  { name: 'Redux', category: 'Frontend', proficiency: 85, order: 5 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 85, order: 6 },
  { name: 'Bootstrap', category: 'Frontend', proficiency: 85, order: 7 },

  // Backend
  { name: 'Node.js', category: 'Backend', proficiency: 90, order: 1 },
  { name: 'Express.js', category: 'Backend', proficiency: 90, order: 2 },
  { name: 'RESTful APIs', category: 'Backend', proficiency: 90, order: 3 },
  { name: 'JWT Authentication', category: 'Backend', proficiency: 85, order: 4 },
  { name: 'Middleware', category: 'Backend', proficiency: 85, order: 5 },

  // Database
  { name: 'MongoDB', category: 'Database', proficiency: 90, order: 1 },
  { name: 'Mongoose', category: 'Database', proficiency: 90, order: 2 },
  { name: 'SQL', category: 'Database', proficiency: 75, order: 3 },
  { name: 'Database Design', category: 'Database', proficiency: 85, order: 4 },

  // Tools
  { name: 'Git', category: 'Tools', proficiency: 90, order: 1 },
  { name: 'GitHub', category: 'Tools', proficiency: 90, order: 2 },
  { name: 'VS Code', category: 'Tools', proficiency: 95, order: 3 },
  { name: 'Postman', category: 'Tools', proficiency: 90, order: 4 },
  { name: 'Docker', category: 'Tools', proficiency: 70, order: 5 },
  { name: 'NPM', category: 'Tools', proficiency: 90, order: 6 },
  { name: 'Webpack', category: 'Tools', proficiency: 75, order: 7 },

  // Testing
  { name: 'Selenium WebDriver', category: 'Testing', proficiency: 80, order: 1 },
  { name: 'WebDriverIO', category: 'Testing', proficiency: 75, order: 2 },
  { name: 'Mocha', category: 'Testing', proficiency: 70, order: 3 },
  { name: 'Unit Testing', category: 'Testing', proficiency: 75, order: 4 }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Project.deleteMany({});
    await Skill.deleteMany({});

    // Insert new data
    console.log('Inserting projects...');
    await Project.insertMany(projects);
    console.log(`✓ Inserted ${projects.length} projects`);

    console.log('Inserting skills...');
    await Skill.insertMany(skills);
    console.log(`✓ Inserted ${skills.length} skills`);

    console.log('\n✓ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
