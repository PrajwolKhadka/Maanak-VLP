# Maanak - Virtual Learning Platform (VLP)

**An intelligent online learning platform for +2 students specializing in Chemistry preparation.**

Maanak-VLP is a modern full-stack web application designed to revolutionize how +2 (higher secondary) students in Nepal prepare for Chemistry. It connects tutors and students through high-quality video content enhanced with AI-powered learning tools.

## ✨ Features

### For Tutors
- **Video Upload & Management**: Upload video links (YouTube, etc.) along with transcripts
- **Content Organization**: Structured lesson management for Chemistry topics
- **AI Integration**: Automatically generate lesson summaries and quizzes from transcripts

### For Students
- **Rich Video Library**: Access curated Chemistry lessons from expert tutors
- **AI-Generated Summaries**: Concise, easy-to-understand lesson recaps
- **Interactive Quizzes**: AI-generated practice questions to test understanding
- **Progress Tracking**: Monitor learning journey and performance

### Technical Highlights
- **AI-Powered Learning**: Transcript analysis → Summary generation → Quiz creation
- **Modern Tech Stack**: Responsive, accessible, and scalable architecture
- **Seamless UX**: Designed as part of a UX Design Module project with user-centric focus

## 🛠 Tech Stack

### Frontend
- **Next.js** (React framework with TypeScript)
- Modern UI components and responsive design
- Tailwind CSS (likely, based on common Next.js setups)

### Backend
- Node.js / Express (or Next.js API routes)
- Database integration for users, lessons, transcripts, and quizzes
- AI integration layer for summary and quiz generation

### Other Technologies
- TypeScript (99%+ of codebase)
- Jest for testing
- ESLint for code quality

## 📁 Project Structure
Maanak-VLP/
├── backend/          # Server-side application
├── frontend/         # Next.js frontend application
└── README.md
text## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Database (MongoDB/PostgreSQL/etc. - check backend config)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PrajwolKhadka/Maanak-VLP.git
   cd Maanak-VLP

Setup BackendBashcd backend
npm install
# Configure environment variables
cp .env.example .env
npm run dev
Setup FrontendBashcd frontend
npm install
npm run dev
Environment Variables
Create .env files in both directories with necessary keys:
Database connection strings
AI API keys (for summary/quiz generation)
Authentication secrets


🎯 Project Goals

Make Chemistry preparation more accessible and engaging for +2 students
Leverage AI to reduce tutor workload and enhance learning outcomes
Provide a scalable platform that can expand to other subjects
Demonstrate excellence in UX design and full-stack development


🤝 Contributing
This project is part of a UX Design Module. Contributions, feedback, and suggestions are welcome!

Fork the project
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
This project is open for educational and learning purposes.
📧 Contact
Prajwol Khadka
Creator & Developer

Made with ❤️ for Nepali students pursuing excellence in Chemistry.
Empowering the next generation of scientists through technology and great UX.