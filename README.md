# 🚀 Student Daily Planner (OS for High Achievers)

The **Student Daily Planner** is an advanced, hyper-focused operating system designed for the top 1% of high achievers. It moves beyond simple to-do lists, offering a comprehensive platform for deep work, habit consistency, and structured daily reflection. 

It is designed to help you dominate your day and automate your success through strategic master routines and focused execution.

## ✨ Features

- 🎯 **Command Center (Dashboard):** A birds-eye view of your day. Track your today's progress, current active blocks, consistency streak, and total deep work hours.
- 📅 **Daily & Weekly Planner:** Break your day into strategic blocks (Morning, Afternoon, Evening). Assign reusable templates and map out subtasks effortlessly.
- ⚡ **Deep Work Hub (Study Timer):** Launch focused Pomodoro sessions directly from your planner. Features a full-screen focus mode with motivational quotes to eliminate distractions.
- 📓 **Daily Reflection & Journaling:** End the day with brutal honesty. Log wins, rate your execution (sleep, diet, output), and adapt for tomorrow.
- 📊 **Advanced Analytics:** GitHub-style Consistency Heatmaps, Deep Work Hourly Distribution, and actionable metrics to mathematically guarantee progress.
- ⚙️ **Customizable Settings:** Manage your profile, set personal preferences, and handle security—all securely synced with the backend.

## 🛠️ Technology Stack

This application is built with a modern, high-performance tech stack:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS (v4) & Vanilla CSS for custom polished designs
- **Animations:** Framer Motion & GSAP for a highly interactive, premium UI
- **Database:** MongoDB & Mongoose
- **Authentication:** NextAuth.js
- **Data Visualization:** Recharts
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Connection String

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Design Philosophy

The application employs a "Dynamic Design" aesthetic. It utilizes harmonious color palettes, modern typography, glassmorphism, and subtle micro-animations to create an interface that feels highly responsive, alive, and un-ignorable. The goal is a premium, aesthetic workspace that encourages interaction and builds long-term consistency.

## 📂 Project Structure

- `/app` - Next.js App Router covering all pages (Dashboard, Login, Signup) and API/Server actions.
- `/components` - Reusable UI elements, layouts, and interactive components.
- `/lib` - Core utilities, MongoDB connection logic, Mongoose models (`User`, `DailyLog`, `Routine`, `Journal`, `AnalyticsActivity`), and NextAuth configuration.
- `/public` - Static assets and global configurations.

## 🤝 Contributing

Feedback and contributions are welcome! Feel free to fork the repository and submit a pull request if you want to improve any workflows or design patterns.

## 📝 License

This project is licensed under the MIT License.
