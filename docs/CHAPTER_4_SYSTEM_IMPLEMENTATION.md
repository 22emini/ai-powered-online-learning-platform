# CHAPTER 4
# SYSTEM IMPLEMENTATION

## 4.1 Implementation Overview

This chapter documents how the AI-Powered Online Learning Platform (Quorify) was built and how different parts of the system were implemented based on the system design. The platform leverages a modern, robust technology stack to deliver a seamless educational experience suitable for students and educators.

The core application is built using **Next.js 15**, a React framework that provides both the frontend user interface and backend API routes through the App Router architecture. This full-stack approach enables server-side rendering (SSR), static generation, and dynamic API endpoints within a single codebase.

For styling and responsive design, **Tailwind CSS v4** is utilized along with **Radix UI** components (Accordion, Dialog, Progress, Select, Separator, Switch, Tooltip, Sheet) to ensure accessibility (a11y), keyboard navigation, and a polished look. The UI is further enhanced with **Framer Motion** for smooth animations and **Lucide React** for consistent iconography.

Data management is handled by **Neon Database** (Serverless PostgreSQL) accessed via **Drizzle ORM**, ensuring type-safe schema definitions, efficient queries, and migration support. The database connection uses the `@neondatabase/serverless` driver with `drizzle-orm/neon-http` for optimal serverless execution.

User authentication and session management are securely provided by **Clerk**, which handles sign-in, sign-up, session tokens, and route protection. The platform integrates Clerk's pre-built components for authentication flows while protecting workspace routes via custom middleware.

A key feature of the platform is its **AI capabilities**, powered by **Google Generative AI (Gemini)** via the `@google/genai` SDK. The platform uses models such as `gemini-2.5-flash` and `gemini-3-flash-preview` for:
- Course layout and structure generation
- Chapter content generation with HTML-formatted topics
- AI-powered summarization
- Quiz generation with multiple-choice questions
- Context-aware AI tutoring via the chatbot

Additional integrations include **YouTube Data API v3** for fetching related educational videos per chapter, and **Pollinations AI** for generating course banner images from AI-generated prompts. The platform also uses **Sonner** for toast notifications and **Recharts** for data visualization in the Analytics dashboard.

---

## 4.2 Technology Stack Summary

| Layer | Technology | Version / Purpose |
|-------|------------|-------------------|
| Framework | Next.js | 15.5.7 – Full-stack React framework |
| Language | JavaScript (JSX) | React 18 |
| Styling | Tailwind CSS | v4 – Utility-first styling |
| UI Components | Radix UI | Accordion, Dialog, Progress, Select, Sheet, Switch, Tooltip |
| Database | Neon Serverless Postgres | Accessed via Drizzle ORM |
| ORM | Drizzle ORM | 0.44.5 – Type-safe queries |
| Authentication | Clerk | 6.32.2 – Auth & session management |
| AI | Google Generative AI (Gemini) | @google/genai 1.21.0 |
| Animations | Framer Motion | 12.23.24 |
| Charts | Recharts | 3.6.0 |
| HTTP Client | Axios | 1.13.5 |
| Video Embed | react-youtube | 10.1.0 |

---

## 4.3 Database Schema

The platform uses five primary tables defined in `config/schema.js`:

### 4.3.1 Users Table
- **id**: Auto-increment primary key  
- **name**: User full name (varchar 255)  
- **email**: Unique email (varchar 255)  
- **subscriptionId**: Optional subscription reference  

### 4.3.2 Courses Table
- **id**: Auto-increment primary key  
- **cid**: Unique course identifier (UUID)  
- **name**: Course title  
- **description**: Course description (varchar 1000)  
- **noOfChapters**: Integer  
- **includeVideo**: Boolean  
- **category**: Course category  
- **courseJson**: JSON – AI-generated course structure (chapters, topics, durations)  
- **courseContent**: JSON – AI-generated content per chapter (topics with HTML content, YouTube videos)  
- **userEmail**: Foreign key to users  
- **bannerImageUrl**: Course banner image URL or base64  

### 4.3.3 Enroll Course Table
- **id**: Auto-increment primary key  
- **cid**: Course ID  
- **userEmail**: Enrolled user  
- **completedChapters**: JSON array of completed chapter indices  

### 4.3.4 Chapter Quizzes Table
- **id**: Auto-increment primary key  
- **courseId**: Course identifier  
- **chapterId**: Chapter index  
- **content**: JSON – Array of questions with options and correct answers  
- **createdAt**: Timestamp  

### 4.3.5 User Analytics Table
- **id**: Auto-increment primary key  
- **userEmail**: User identifier  
- **courseId**: Course identifier  
- **chapterId**: Chapter index  
- **eventType**: 'TIME_SPENT' or 'QUIZ_SCORE'  
- **value**: Seconds (for time) or score (for quiz)  
- **createdAt**: Timestamp  

---

## 4.4 API Routes Implementation

### 4.4.1 Generate Course Layout (`/api/generate-course-layout`)
- **Method**: POST  
- **Purpose**: Creates the full course structure using Gemini AI based on user input (name, description, noOfChapters, category, level, includeVideo).  
- **Process**: Sends a structured prompt to `gemini-3-flash-preview`, parses JSON response containing course metadata and `bannerImagePrompt`, generates banner image via Pollinations AI, stores course in database with `courseJson` and `bannerImageUrl`.  
- **Returns**: `courseId` for redirect to edit page.  

### 4.4.2 Generate Course Content (`/api/generate-course-content`)
- **Method**: POST  
- **Purpose**: Generates HTML content for each chapter’s topics using Gemini, and fetches related YouTube videos via YouTube Data API.  
- **Process**: For each chapter in `courseJson.chapters`, calls Gemini to produce topic-wise HTML content; in parallel, fetches up to 4 YouTube videos per chapter; updates `courseContent` in database.  

### 4.4.3 Generate Summary (`/api/generate-summary`)
- **Method**: POST  
- **Purpose**: Summarizes user-provided text using Gemini 2.5 Flash.  
- **Input**: `{ text }`  
- **Returns**: `{ result: summary }`  
- **Error handling**: Rate limiting (429) and generic error responses.  

### 4.4.4 Generate Quiz (`/api/generate-quiz`)
- **Method**: POST  
- **Purpose**: Generates 10 multiple-choice questions from chapter content.  
- **Input**: `courseId`, `chapterId`, `chapterContent`  
- **Process**: Sends chapter content to Gemini with a strict JSON schema; parses response; validates structure; inserts into `chapterQuizzes` table.  
- **Returns**: `{ ok: true, content }` or error.  

### 4.4.5 Get Quiz (`/api/get-quiz`)
- **Method**: POST  
- **Purpose**: Retrieves existing quiz for a chapter.  
- **Input**: `courseId`, `chapterId`  
- **Returns**: `{ found: true, content }` or `{ found: false }`.  

### 4.4.6 Chat (`/api/chat`)
- **Method**: POST  
- **Purpose**: Powers the AI Tutor chatbot with course-specific context.  
- **Input**: `messages` (array of `{ role, content }`), optional `courseId`  
- **Process**: If `courseId` provided, fetches course metadata and `courseJson` from database; builds system prompt with course context; sends combined prompt to Gemini 2.5 Flash; returns AI response.  
- **Returns**: `{ result: responseText }`.  

### 4.4.7 Analytics (`/api/analytics`)
- **Method**: POST – Records analytics events (TIME_SPENT, QUIZ_SCORE).  
- **Method**: GET – Returns aggregated data: `totalTimeSpent`, `completedCoursesCount`, `quizScores` (ordered by date).  
- **Authentication**: Requires Clerk `currentUser`.  

### 4.4.8 Courses (`/api/courses`)
- **GET**:  
  - `courseId=0`: Public course catalog with search and pagination (only courses with `courseContent != {}`).  
  - `courseId=<id>`: Single course details.  
  - No courseId + authenticated: User’s created courses.  
- **DELETE**: Removes course (and related enrollments, quizzes, analytics) if user owns it.  

### 4.4.9 Enroll Course (`/api/enroll-course`)
- **POST**: Enrolls user in course (checks for duplicate enrollment).  
- **GET**: With `courseId` – returns enrolled course with full course data; without – returns paginated list of enrolled courses.  
- **PUT**: Updates `completedChapters` for progress tracking.  

### 4.4.10 User (`/api/user`)
- User-related operations (if defined).  

---

## 4.5 Middleware and Route Protection

The `middleware.js` file uses Clerk’s `clerkMiddleware` and `createRouteMatcher` to protect all routes under `/workspace(.*)`. Unauthenticated users are redirected to sign-in. The matcher excludes static assets and Next.js internals while running for API and page routes.  

---

## 4.6 Graphical User Interface of the Project

The Graphical User Interface (GUI) refers to the visual representation that students and educators interact with. It is designed to be intuitive, responsive, and accessible.

---

### 4.2.1 Landing Page

The application starts with a welcoming Landing Page at the root (`/`). It introduces the platform’s value proposition with:
- Hero section with gradient headline “Learn smarter with AI-powered personalized education”
- Animated background orbs using Framer Motion
- Feature cards: AI-Powered Tutoring, Adaptive Learning Paths, Real-Time Feedback, Collaborative Learning, Progress Analytics, Expert-Verified Content
- Stats section: Student satisfaction, Faster learning, Expert courses, 24/7 AI tutor support
- Trusted-by section (MIT, Stanford, Harvard, Oxford, Cambridge)
- “Powered by Google Gemini” badge

If the user is already authenticated (`userId` from Clerk), they are automatically redirected to `/workspace`.

**Figure 4.1: Landing Page**

---

### 4.2.2 Authentication Pages

#### 4.2.2.1 Sign In Page
Located at `/sign-in/[[...sign-up]]`, the Sign In page uses Clerk’s `<SignIn />` component. Users can log in via email/password or social providers. The page is centered on a full-height layout for a clean, focused experience. Route protection ensures unauthenticated users cannot access the workspace.

**Figure 4.2: Sign In Page**

#### 4.2.2.2 Sign Up Page
Located at `/sign-up/[[...sign-up]]`, the Sign Up page uses Clerk’s `<SignUp />` component for new user registration. The process collects necessary information to create a personal profile on the platform.

**Figure 4.3: Sign Up Page**

---

### 4.2.3 Workspace Dashboard

Upon logging in, users are directed to `/workspace`, which serves as the central hub. The layout includes:
- **WelcomeBanner**: Gradient banner with “Welcome to your Online Learning Platform” and tagline
- **EnrollCourseList**: Displays enrolled courses with progress
- **CourseList**: Displays user-created courses
- **AppSideBar**: Navigation to Dashboard, My Learning, Explore Courses, Analytics, AI Summarizer, Profile; “Create New Course” button; Logout
- **AppHeader**: Top bar with branding and navigation

The layout is designed for quick navigation to “My Learning”, “Explore”, and “Analytics”.

**Figure 4.4: User Workspace Dashboard**

---

### 4.2.4 Explore Courses

The Explore page (`/workspace/explore`) allows users to discover new learning materials. It presents a catalog of AI-generated and user-created courses with:
- Search input with debounced query
- Pagination (6 courses per page)
- **CourseCard** components showing course details, banner image, and “Enroll” action
- Loading skeletons during fetch

The `/api/courses` endpoint with `courseId=0` returns only courses that have generated content, with search support on name and description.

**Figure 4.5: Explore Courses Page**

---

### 4.2.5 Course View

When a user selects an enrolled course, they are presented with the Course View at `/course/[courseId]`. The interface includes:
- **ChapterListSidebar**: Lists all chapters with completion status; clicking selects the active chapter
- **ChapterContent**: Main content area displaying:
  - Chapter header with title, progress badge, topic count, video count
  - “Download content” (exports HTML/Word-formatted document)
  - “Mark completed” / “Mark incomplete”
  - “Take Quiz” button
  - Related YouTube videos (top 2) embedded via `react-youtube`
  - Topics with HTML-rendered content
- **AITutorChatbot**: Floating AI tutor widget (see 4.2.11)
- **SelectChapterIndexContext**: React context for active chapter selection

Time spent is tracked every 30 seconds and sent to `/api/analytics` as `TIME_SPENT` events.

**Figure 4.6: Course View**

---

### 4.2.6 AI Summarizer

The AI Summarizer (`/workspace/ai-summarizer`) allows users to get instant, AI-generated summaries of complex text. Features:
- Large textarea for input (articles, notes, documents)
- “Summarize Text” button calling `/api/generate-summary`
- Animated result card with summary output
- “Copy” button to copy summary to clipboard
- Loading state with spinner
- Error handling and toast notifications (Sonner)

**Figure 4.7: AI Summarizer**

---

### 4.2.7 Analytics Dashboard

The Analytics page (`/workspace/analytics`) provides visual feedback on learning progress:
- **Total Time Spent**: Aggregated from `TIME_SPENT` events (formatted as hours and minutes)
- **Courses Completed**: Count of enrollments where `completedChapters.length >= noOfChapters`
- **Quizzes Taken**: Count of `QUIZ_SCORE` events
- **Quiz Performance History**: Line chart (Recharts) showing quiz scores over time with dates
- Placeholder area for future charts

Data is fetched via GET `/api/analytics`.

**Figure 4.8: Analytics Dashboard**

---

### 4.2.8 Profile Management

The Profile page (`/workspace/profile`) uses Clerk’s `<UserProfile />` component, allowing users to view and update personal information, email, password, and account settings. User data acts as the single source of truth for identity on the platform.

**Figure 4.9: Profile Management Page**

---

### 4.2.9 Create/Edit Course

For content creators, the Create/Edit Course flow is implemented as follows:

1. **Create New Course**:  
   - **AddNewCourseDiaglog** opens a modal with form fields: Course Name, Description, Number of Chapters, Include Video (switch), Difficulty Level (Select: Beginner/Moderate/Advanced), Category.  
   - On “Generate Course”, a UUID is generated and POST `/api/generate-course-layout` is called.  
   - User is redirected to `/workspace/edit-course/[courseId]`.  

2. **Edit Course Page** (`/workspace/edit-course/[courseId]`):  
   - **CourseInfo**: Displays course metadata (name, description, duration, chapters count, level), banner image, “Generate Content” button, and “Continue Learning” if content exists.  
   - **ChapterTopicList**: Visual representation of chapters and topics in a tree-like layout.  
   - “Generate Content” triggers POST `/api/generate-course-content`, which generates HTML content and YouTube videos for each chapter, then updates the database.  

**Figure 4.10: Course Creation Interface**

---

### 4.2.10 Quiz Generator

The platform features an AI-powered Quiz Generator integrated into the Course View. When a user clicks “Take Quiz” for a chapter:

- **Dynamic Generation**: If no quiz exists in `chapterQuizzes`, the system calls POST `/api/generate-quiz` with `courseId`, `chapterId`, and `chapterContent`. Gemini generates 10 multiple-choice questions in a strict JSON schema; the result is saved to the database.
- **Fetch Existing**: If a quiz exists, POST `/api/get-quiz` retrieves it.
- **Interactive Interface**: The quiz is shown in a Radix Dialog modal. Users see one question at a time, select an option, and use “Next” / “Submit”.
- **Instant Feedback**: On submission, scores are calculated (correct answers vs total). Results show Score, Percentage, and Pass/Fail (≥70% = Pass). The score is sent to `/api/analytics` as `QUIZ_SCORE`.
- **Retry**: User can close the modal and retake the quiz.

**Figure 4.11: Chapter Quiz Interface**

---

### 4.2.11 AI Tutor Chatbot

The platform features an integrated AI Tutor Chatbot implemented in `ChatBot.jsx`:

- **Contextual Intelligence**: The chatbot receives the active `courseId`. The `/api/chat` endpoint fetches course details (name, description, courseJson) and injects them into the system prompt. This ensures answers are grounded in the course material.
- **User-Centric Design**: A floating button (bottom-right) toggles the chat window. The window uses Framer Motion for open/close animations. Messages are displayed with distinct styling for user vs assistant; a typing indicator appears during loading.
- **Advanced AI Backend**: Uses Gemini 2.5 Flash model. Messages are sent as a combined prompt (system + conversation history) to maintain context.
- **Availability**: Accessible from the Course View, providing 24/7 personalized tutoring for the active course.

**Figure 4.12: AI Tutor Chatbot Window**

---

## 4.7 Key Component Architecture

| Component | Location | Responsibility |
|-----------|----------|----------------|
| AppHeader | workspace/_components | Top navigation, sidebar toggle |
| AppSideBar | workspace/_components | Sidebar menu, Create Course, Logout |
| WelcomeBanner | workspace/_components | Dashboard welcome message |
| CourseList | workspace/_components | User-created courses |
| EnrollCourseList | workspace/_components | Enrolled courses with progress |
| CourseCard | workspace/_components | Course card for Explore |
| EnrollCourseCard | workspace/_components | Enrolled course card |
| ChapterListSidebar | course/_components | Chapter navigation in course view |
| ChapterContent | course/_components | Chapter content, quiz, videos |
| ChapterTopicList | workspace/_components | Chapter/topic tree in edit |
| CourseInfo | workspace/edit-course/_components | Course metadata, Generate Content |
| AddNewCourseDiaglog | workspace/_components | Create course modal |
| AITutorChatbot (ChatBot) | components | Floating AI tutor widget |

---

## 4.8 Environment Variables

The platform requires the following environment variables:

- `DATABASE_URL`: Neon PostgreSQL connection string  
- `GEMINI_API_KEY`: Google Generative AI API key  
- `GEMINI_MODEL`: (Optional) Model name, defaults to `gemini-2.5-flash`  
- `YOUTUBE_API_KEY`: YouTube Data API v3 key (for course content)  
- `NEXT_PUBLIC_CLERK_*` / `CLERK_*`: Clerk authentication keys  

---

## 4.9 Build and Deployment

- **Development**: `npm run dev` – Next.js development server  
- **Build**: `npm run build` – Production build  
- **Start**: `npm start` – Production server  
- **Database**: `npm run db:push` – Push schema via Drizzle  
- **Database Studio**: `npm run db:studio` – Drizzle Studio for data inspection  

---

## 4.10 Summary

The AI-Powered Online Learning Platform (Quorify) implements a complete learning management system with:

- **AI-Driven Content**: Course structure, topic content, summaries, and quizzes generated by Google Gemini  
- **Rich Learning Experience**: Video integration (YouTube), progress tracking, chapter completion  
- **Analytics**: Time spent, quiz scores, and course completion metrics with Recharts visualizations  
- **Contextual AI Tutoring**: Course-aware chatbot for real-time assistance  
- **Secure, Scalable Architecture**: Next.js 15, Neon Postgres, Drizzle ORM, and Clerk authentication  

The implementation aligns with modern web development best practices and is suitable for deployment as a production-ready educational platform.
