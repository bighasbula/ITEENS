# ARENA - Competitive Coding Platform


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


