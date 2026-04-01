# Fahad Ali - MERN Stack Portfolio

A modern, full-stack portfolio website built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring a distinctive design, smooth animations, and professional presentation.

## 🚀 Features

### Frontend
- **Modern React Application** with React Router for navigation
- **Distinctive Design** with custom color scheme and typography
- **Smooth Animations** using Framer Motion
- **Responsive Design** optimized for all devices
- **Type Animation** for dynamic hero section
- **Intersection Observer** for scroll-triggered animations
- **Contact Form** with client-side validation

### Backend
- **RESTful API** built with Express.js
- **MongoDB Database** with Mongoose ODM
- **Email Integration** using Nodemailer
- **Input Validation** with express-validator
- **Security Features**:
  - Helmet for security headers
  - CORS configuration
  - Rate limiting
  - Input sanitization

### Key Pages
1. **Home** - Hero section, About, Skills showcase, Featured projects
2. **Projects** - Filterable project gallery with detailed information
3. **Contact** - Working contact form with email notifications

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Fahad-Ali/portfolio-mern.git
cd portfolio-mern
```

### 2. Install Dependencies

Install backend dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development

# MongoDB (Local or Atlas)
MONGODB_URI=mongodb://localhost:27017/portfolio
# For production with MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=fahadj698@gmail.com

# Client URL
CLIENT_URL=http://localhost:3000
```

#### Setting up Gmail for Email Notifications:
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings > Security
   - Under "Signing in to Google," select "App passwords"
   - Generate a new app password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

### 4. Database Setup

Start MongoDB (if running locally):
```bash
mongod
```

Seed the database with initial data:
```bash
npm run seed
```

This will populate your database with:
- Sample projects
- Skills data

### 5. Running the Application

#### Development Mode (Recommended)
Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Production Mode
Build the React app:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

The app will be available at `http://localhost:5000`

## 📁 Project Structure

```
portfolio-mern/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # Reusable components
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   └── ScrollToTop.js
│       ├── pages/           # Page components
│       │   ├── Home.js
│       │   ├── Projects.js
│       │   └── Contact.js
│       ├── App.js
│       ├── App.css
│       └── index.js
├── controllers/             # Request handlers
│   ├── contactController.js
│   ├── projectController.js
│   └── skillController.js
├── models/                  # Mongoose models
│   ├── Contact.js
│   ├── Project.js
│   └── Skill.js
├── routes/                  # API routes
│   ├── contact.js
│   ├── projects.js
│   └── skills.js
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
├── seed.js                 # Database seeding script
├── server.js               # Express server entry point
└── README.md
```

## 🎨 Customization

### Adding Your Own Projects

1. **Via Database**: Add projects directly to MongoDB
2. **Via Seed Script**: Edit `seed.js` and run `npm run seed`
3. **Manually**: Use MongoDB Compass or the MongoDB shell

Project Schema:
```javascript
{
  title: String,
  description: String,
  technologies: [String],
  features: [String],
  githubUrl: String,
  liveUrl: String,
  imageUrl: String,
  category: String,  // 'Full-Stack', 'Frontend', 'Backend', 'WordPress'
  featured: Boolean,
  order: Number
}
```

### Updating Skills

Edit the skills array in `seed.js` or add them to the database:
```javascript
{
  name: String,
  category: String,  // 'Frontend', 'Backend', 'Database', 'Tools', 'Testing'
  proficiency: Number,  // 0-100
  order: Number
}
```

### Changing Colors & Theme

Edit CSS variables in `client/src/App.css`:
```css
:root {
  --color-bg: #0a0a0a;
  --color-accent: #00ff88;
  --font-display: 'Syne', sans-serif;
  --font-body: 'Urbanist', sans-serif;
}
```

### Updating Personal Information

1. Update contact details in `client/src/pages/Contact.js`
2. Update social links in `client/src/components/Footer.js`
3. Update the hero section in `client/src/pages/Home.js`
4. Replace favicon and images in `client/public/`

## 📧 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get single project

### Skills
- `GET /api/skills` - Get all skills (grouped by category)
- `GET /api/skills/category/:category` - Get skills by category

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (for admin)

### Health Check
- `GET /api/health` - Server health check

## 🚀 Deployment

### Deploying to Heroku

1. Create a Heroku app:
```bash
heroku create your-portfolio-name
```

2. Add MongoDB Atlas addon or configure your own MongoDB:
```bash
heroku addons:create mongolab:sandbox
```

3. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_USER=your-email@gmail.com
# ... set other variables
```

4. Deploy:
```bash
git push heroku main
```

5. Seed the database:
```bash
heroku run node seed.js
```

### Deploying to Vercel (Frontend) + Railway (Backend)

**Backend (Railway):**
1. Push your code to GitHub
2. Connect Railway to your GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy

**Frontend (Vercel):**
1. Update API URLs in React code to point to Railway backend
2. Build the frontend
3. Deploy to Vercel

### Deploying to DigitalOcean

1. Create a Droplet (Ubuntu)
2. Install Node.js and MongoDB
3. Clone your repository
4. Install dependencies
5. Set up environment variables
6. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

7. Set up Nginx as reverse proxy
8. Configure SSL with Let's Encrypt

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run server` - Start backend server with nodemon
- `npm run client` - Start React development server
- `npm run dev` - Run both backend and frontend concurrently
- `npm run build` - Build React app for production
- `npm run seed` - Seed database with initial data

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configured for specific origins
- **Rate Limiting**: Prevents abuse of API endpoints
- **Input Validation**: Using express-validator
- **Input Sanitization**: Prevents XSS and injection attacks
- **Environment Variables**: Sensitive data stored securely

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For Atlas: Whitelist your IP address

### Email Not Sending
- Verify Gmail app password is correct
- Check firewall/antivirus settings
- Ensure 2FA is enabled on Gmail account

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear React cache: `cd client && rm -rf node_modules && npm install`

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Fahad Ali**
- Email: fahadj698@gmail.com
- Phone: +92-309-9639354
- LinkedIn: [Fahad-Ali](https://linkedin.com/in/Fahad-Ali)
- GitHub: [Fahad-Ali](https://github.com/Fahad-Ali)

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Icons from React Icons
- Fonts from Google Fonts (Syne, Urbanist)
- Images from Unsplash

---

**Built with ❤ using MERN Stack**
