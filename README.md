# Run PR Tracker 🏃‍♂️

A modern web application for runners to track their personal records (PRs) across various distances. Built with Next.js 14, React, and Supabase.

## 🌟 Features

### User Management
- Secure email-based authentication
- Personal profile creation with customizable bio
- Profile picture upload and management

### Personal Records Tracking
- Track PRs for multiple distances:
  - 1 mile
  - 5K
  - 10K
  - Half Marathon
  - Full Marathon
- For each PR, record:
  - Completion time (HH:MM:SS)
  - Race/Location information
  - Date achieved

### User Experience
- Clean, intuitive interface
- Mobile-responsive design
- Real-time data updates
- Secure data storage

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js 14 (App Router)
  - React
  - TypeScript
  - Tailwind CSS for styling
  - ShadCN UI components

- **Backend**:
  - Supabase for authentication
  - Supabase PostgreSQL database
  - Supabase Storage for image uploads

## 🚀 Live Demo

Visit [https://run-pr-tracker.vercel.app](https://run-pr-tracker.vercel.app) to see the app in action.

## 📱 Usage

1. **Sign Up/Login**:
   - Create an account using your email
   - Verify your email address
   - Log in to access your dashboard

2. **Profile Setup**:
   - Upload a profile picture
   - Add your name and location
   - Write a brief bio

3. **Track Your PRs**:
   - Enter your best times for each distance
   - Record where and when you achieved each PR
   - Save your records securely

## 🔒 Security Features

- Row Level Security (RLS) policies ensure users can only access their own data
- Secure authentication flow
- Protected API routes
- Secure image upload handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.