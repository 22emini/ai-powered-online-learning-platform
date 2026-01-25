# CHAPTER 4

# SYSTEM IMPLEMENTATION

## 4.1 Implementation Overview

This chapter explains how the AI-Powered Online Learning Platform was built and how different parts of the system were implemented based on the system design. The platform leverages a modern, robust technology stack to deliver a seamless educational experience.

The core application is built using **Next.js**, a React framework that handles both the frontend user interface and backend API routes. For styling and responsive design, **Tailwind CSS** is utilized along with **Radix UI** components to ensure accessibility and a polished look.

Data management is handled by **Neon Database** (Serverless Postgres) accessed via **Drizzle ORM**, ensuring type-safe and efficient database interactions. User authentication and session management are securely provided by **Clerk**. A key feature of the platform is its AI capabilities, powered by **Google Generative AI**, which assists in generating course content and providing intelligent summaries.

## 4.2 Graphical User Interface of the Project

The Graphical User Interface (GUI) of the proposed system refers to the visual representation that students and educators interact with. It is designed to be intuitive, responsive, and accessible. The following sections describe the key interfaces of the application.

### 4.2.1 Landing Page

The application starts with a welcoming Landing Page that introduces the platform's value proposition. It features a modern design with a clear call-to-action for new users to get started. Navigate to the landing page to see the overview of features offered.

**Figure 4.1: Landing Page**

### 4.2.2 Authentication Pages

To ensure data security and personalized experiences, users must authenticate themselves.

#### 4.2.2.1 Sign In Page

Existing users can log in securely using their credentials or social providers. The Sign In page is streamlined to reduce friction while maintaining security standards.

**Figure 4.2: Sign In Page**

#### 4.2.2.2 Sign Up Page

New users can register for an account easily. The Sign Up process collects necessary information to create a personal profile on the platform.

**Figure 4.3: Sign Up Page**

### 4.2.3 Workspace Dashboard

Upon logging in, users are directed to the Workspace Dashboard. This serves as the central hub where users can access all main features, including their ongoing courses, analytics, and content creation tools. The layout is designed for quick navigation to "My Learning", "Explore", and "Analytics".

**Figure 4.4: User Workspace Dashboard**

### 4.2.4 Explore Courses

The Explore page allows users to discover new learning materials. It presents a catalog of capable AI-generated courses and user-created content. Users can filter and search for topics of interest.

**Figure 4.5: Explore Courses Page**

### 4.2.5 Course View & AI Summarizer

When a user selects a course, they are presented with the Course View. This interface displays the curriculum, video content, and text materials.

A unique feature shown here is the **AI Summarizer**, which allows users to get instant, AI-generated summaries of complex topics, enhancing the learning efficiency.

**Figure 4.6: Course View with AI Summarizer**

### 4.2.6 Analytics Dashboard

The Analytics section provides users with visual feedback on their learning progress. Using data visualization libraries like Recharts, the system displays graphs and progress bars indicating course completion rates, time spent, and other key performance metrics.

**Figure 4.7: Analytics Dashboard**

### 4.2.7 Profile Management

The Profile page allows users to view and update their personal information and account settings. This ensures that user data acts as the single source of truth for their identity on the platform.

**Figure 4.8: Profile Management Page**

### 4.2.8 Create/Edit Course

For content creators, the 'Edit Course' interface provides tools to structure curriculums and input content. The AI assistant is integrated here to suggest content or help draft course modules.

**Figure 4.9: Course Creation Interface**

### 4.2.9 Quiz Generator

To reinforce learning, the platform features an AI-powered Quiz Generator. This tool assesses user understanding by generating multiple-choice questions based on the specific content of each chapter.

- **Dynamic Generation**: If a quiz doesn't exist, the system generates one on-the-fly using the chapter content.
- **Interactive Interface**: Users take the quiz in a modal window, ensuring focused attention without navigating away from the learning material.
- **Instant Feedback**: Scores are calculated immediately upon submission, providing users with instant performance metrics (Score, Percentage, Pass/Fail status).

**Figure 4.10: Chapter Quiz Interface**

### 4.2.10 AI Tutor Chatbot

To provide real-time assistance, an **AI Tutor Chatbot** is integrated directly into the course interface. This intelligent assistant is context-aware, meaning it has access to the specific course material and structure the user is currently studying.

- **Contextual Assistance**: The chatbot helps students by answering questions specifically related to the current course, utilizing the course description and content as context.
- **Accessible UI**: It is implemented as a non-intrusive floating widget at the bottom-right of the screen, expandable on demand.
- **Powered by Gemini**: The backend leverages **Google's Gemini 2.5 Flash** model to generate accurate and helpful responses, simulating a knowledgeable human tutor.

**Figure 4.11: AI Tutor Chatbot Window**
