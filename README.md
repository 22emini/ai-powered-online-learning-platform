# 🎓 AI Powered Online Learning Platform

> **Revolutionizing education with personalized AI-generated courses, interactive quizzes, and smart summaries.**

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)

## 🚀 Overview

The **AI Powered Online Learning Platform** is a cutting-edge educational tool designed to create personalized learning experiences on the fly. By leveraging the power of **Google Gemini AI**, users can generate entire courses, complete with chapters, detailed content, and quizzes, simply by providing a topic.

Whether you're a student looking to master a new subject or a lifelong learner exploring specific interests, our platform tailors the content to your needs.

## ✨ Key Features

- **🤖 AI Course Generation**: Instantly generate structured courses with chapters and sub-chapters based on any topic.
- **📚 Dynamic Content**: Detailed lesson content generated in real-time using generative AI.
- **🧠 Interactive Quizzes**: Test your knowledge with AI-generated quizzes for every chapter.
- **📝 Smart Summaries**: Get concise summaries of complex topics to reinforce learning.
- **🛣️ Personalized Paths**: Learning journeys customized to your pace and interests.
- **🔐 Secure Authentication**: Integrated with Clerk for seamless and secure user management.
- **⚡ Modern Tech Stack**: Built with Next.js 14 and configured with Drizzle ORM and Neon DB for high performance.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **AI Model**: [Google Gemini](https://deepmind.google/technologies/gemini/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm / yarn / pnpm / bun

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-powered-online-learning-platform.git
cd ai-powered-online-learning-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory and populate it with your keys:

```bash
# Public
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_HOST_URL=http://localhost:3000

# Secrets
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require
GEMINI_API_KEY=AIzaSy...
```

### 4. Database Setup

Push the schema to your Neon database:

```bash
npm run db:push
```

Optionally, open Drizzle Studio to view your data:

```bash
npm run db:studio
```

### 5. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
