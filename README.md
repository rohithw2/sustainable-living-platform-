# Sustainable Living Education Platform (FEDF-PS50)

A React-based web application that educates users about sustainable living through interactive lessons, project ideas, and sustainability resources.

## Features

- **Two User Roles**: Admin and User with different permissions
- **Interactive Lessons**: Access to educational content about sustainable living
- **Progress Tracking**: Users can track their progress through lessons
- **Admin Dashboard**: Manage lessons and track user engagement
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all device sizes

## Tech Stack

- React with Vite
- React Router for navigation
- Material UI for components
- Context API for state management
- Local Storage for data persistence
- Chart.js for analytics visualization

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```
   cd sustainable-living-platform
   npm install
   ```

3. **Run the development server**
   ```
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Login Information

- **User Role**: 
  - Username: user
  - Password: password

- **Admin Role**: 
  - Username: admin
  - Password: admin123

## Project Structure

```
sustainable-living-platform/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── admin/
│   │   ├── common/
│   │   ├── layout/
│   │   └── user/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```
