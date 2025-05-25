## Getting Started

### Frontend (React)

1-

cd frontend

2-

npm install

3-

npm run dev

/---------------------------------------------/

# Step 1: Create React project with Vite

npm create vite

# Enter name, select React, JavaScript

cd your-project-name

# Step 2: Install dependencies

npm install
npm install axios react-router-dom sass

# Step 3: Configure environment

cp .env.example .env

# Add VITE_API_URL=http://localhost:8000/api or your backend URL

# Step 4: Start the development server

npm run dev

## Frontend Implementation Overview

Project Setup

Created using Vite + React + JavaScript

Axios for API requests

React Router DOM for routing

Context API for user state management

SASS for styling

src/
│
├── components/
│ ├── CustomButton.jsx, CustomButton.scss
│ ├── FormInput.jsx, FormInput.scss
│ ├── SignInForm.jsx, SignInForm.scss
│ ├── SignUpForm.jsx, SignUpForm.scss
│ └── PrivateRoute.jsx
│
├── context/
│ └── UserContext.jsx
│
├── api/
│ └── axios.js
│
├── pages/
│ ├── Dashboard.jsx, Dashboard.scss
│ ├── Post.jsx, Post.scss
│ ├── Settings.jsx, Settings.scss
│ ├── Analytics.jsx, Analytics.scss
│ └── Authentication.jsx, Authentication.scss
│
└── App.jsx

# Authentication

UserContext manages currentUser & token via localStorage

PrivateRoute ensures authenticated access

SignInForm and SignUpForm interact with backend auth APIs

# Posts & Platforms

Post.jsx: Create post using API, fetch platforms

Settings.jsx: View platforms and toggle post-platform status via toggle API

# Analytics

Analytics.jsx counts:

Toggled posts

Published posts

Scheduled posts

Total posts

Table shows posts per platform and percentage of success rate

# Navigation

Navigation.jsx header switches between Login/Logout based on token presence

Logout clears token/localStorage and calls backend logout API

# API Handling

axios.js sets headers and interceptors:

headers: {
'Content-Type': 'application/json',
Accept: 'application/json',
Authorization: `Bearer ${token}`
}

# Summary

Laravel Sanctum handles secure user authentication.

Posts are scheduled and toggled across platforms.

A job system publishes scheduled posts automatically.

React + Vite frontend manages UI and state with token-based auth.
