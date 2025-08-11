# ARENA - Competitive Coding Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Features

### Core Features (MVP)
- **Practice Mode**: Solve coding problems with instant feedback
- **Code Editor**: Monaco Editor with syntax highlighting and multiple language support
- **Code Execution**: Judge0 integration for running and testing code

- **User Progress Tracking**: Comprehensive statistics and submission history

### Tech Stack
- **Frontend**: Next.js 14 with App Router
- **UI Components**: shadcn/ui with Tailwind CSS
- **Authentication**: Clerk
- **Backend**: Convex (database and serverless functions)
- **Code Editor**: Monaco Editor
- **Code Execution**: Judge0 API


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 📊 User Progress Tracking

The platform includes comprehensive user progress tracking with the following features:

### Database Schema
- **Users Table**: Stores user statistics including total problems solved, current streak, best time, and join date
- **Submissions Table**: Tracks all code submissions with performance metrics, execution time, and memory usage

### Key Metrics Tracked
- **Problems Solved**: Total count of successfully solved problems
- **Current Streak**: Consecutive days with successful submissions
- **Best Time**: Fastest time to solve a problem
- **Success Rate**: Percentage of correct submissions
- **Average Time**: Average time taken for correct solutions
- **Submission History**: Detailed log of all attempts

### Automatic User Creation
- Users are automatically created in the Convex database upon first login
- Integration with Clerk authentication ensures seamless user management

## 🔧 API Setup

### Judge0 Setup Guide
See the detailed Judge0 setup guide in the project for code execution configuration.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
