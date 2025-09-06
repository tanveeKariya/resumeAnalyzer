# CareerAI - Intelligent Hiring Platform

An AI-powered recruitment platform that revolutionizes hiring with intelligent resume analysis, job matching, and interview scheduling.

## 🚀 Features

- **AI Resume Analysis**: Advanced NLP-powered resume parsing and skill extraction
- **Smart Job Matching**: Intelligent candidate-job matching with scoring algorithms
- **Automated Testing**: AI-generated technical assessments
- **Interview Scheduling**: Seamless Google Meet integration
- **Feedback Analysis**: AI-powered interview feedback processing
- **Real-time Dashboard**: Comprehensive analytics for HR and candidates

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Axios** for API communication
- **React Router** for navigation

### Backend
- **Node.js** with Express.js
- **MongoDB** for data storage
- **JWT** for authentication
- **DeepSeek AI** for NLP processing
- **Google Meet API** for video interviews

## 📋 Prerequisites

Before running the application, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd career-ai
```

### 2. Install Dependencies

**Frontend Dependencies:**
```bash
npm install
```

**Backend Dependencies:**
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_DEEPSEEK_API_KEY=sk-57104a7f80b94a2eb28e88abe51203b6
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
```

**Backend (backend/.env):**
```env
MONGODB_URI=mongodb://localhost:27017/career-ai
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=24h
DEEPSEEK_API_KEY=sk-57104a7f80b94a2eb28e88abe51203b6
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Database Setup

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster and get connection string
3. Update `MONGODB_URI` in `backend/.env`

### 5. Running the Application

**Option 1: Run Both Frontend and Backend Together**
```bash
npm run dev:full
```

**Option 2: Run Separately**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🎯 Demo Accounts

The application includes demo accounts for testing:

**HR Demo Account:**
- Email: `hr@demo.com`
- Password: `demo123`
- Role: HR Manager

**Candidate Demo Account:**
- Email: `candidate@demo.com`
- Password: `demo123`
- Role: Job Candidate

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Project Structure

```
career-ai/
├── src/                    # Frontend source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── services/          # API and business logic
│   ├── contexts/          # React contexts
│   └── styles/            # CSS and styling
├── backend/               # Backend source code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
└── public/               # Static assets
```

## 🚨 Troubleshooting

### Common Issues

**1. Backend Connection Failed**
- Ensure backend is running on port 5000
- Check if MongoDB is running
- Verify environment variables are set correctly

**2. MongoDB Connection Error**
- Check if MongoDB service is running
- Verify connection string in `.env`
- For Atlas: Check network access and credentials

**3. AI Features Not Working**
- Verify DeepSeek API key is valid
- Check internet connection
- API calls will fallback to demo mode if service is unavailable

**4. Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Demo Mode

If the backend is not available, the application automatically falls back to demo mode with:
- Mock authentication
- Local data storage
- Simulated AI responses
- Sample data for testing

## 🌟 Key Features Walkthrough

### For Candidates
1. **Sign Up/Login** as a candidate
2. **Upload Resume** - AI analyzes and extracts information
3. **View Job Matches** - See personalized job recommendations
4. **Take Tests** - Complete AI-generated technical assessments
5. **Schedule Interviews** - Manage interview appointments
6. **Track Applications** - Monitor application status

### For HR Managers
1. **Sign Up/Login** as HR
2. **Post Jobs** - Create job listings with requirements
3. **Review Candidates** - See AI-matched candidates with scores
4. **Schedule Interviews** - Set up video interviews
5. **Collect Feedback** - AI-powered feedback analysis
6. **Manage Pipeline** - Track recruitment progress

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Rate limiting (production)
- Environment variable protection

## 📊 AI Capabilities

- **Resume Parsing**: Extract skills, experience, education
- **Job Matching**: Intelligent scoring algorithms
- **Question Generation**: Dynamic technical assessments
- **Feedback Analysis**: Sentiment analysis and insights
- **Candidate Briefing**: Automated candidate summaries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all dependencies are installed correctly
3. Verify environment variables are set
4. Check console logs for detailed error messages

For additional help, please create an issue in the repository.