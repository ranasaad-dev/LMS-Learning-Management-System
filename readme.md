# 📚 LMS Platform (Learning Management System)

A full-stack **Learning Management System (LMS)** built with modern web technologies.  
This platform allows **students to enroll in courses, watch lessons, track progress, and leave reviews**, while **instructors can create and manage courses**.

The project is inspired by platforms like **Udemy** and **Coursera**.

---

# 🚀 Features

## 👨‍🎓 Student Features
- Browse available courses
- View course details
- Enroll in courses
- Watch lessons
- Track learning progress 
- Write course reviews
- Manage profile
- Stay up-to-date throgh Notice Board
  
## 👨‍🏫 Instructor Features
- Create courses
- Manage lessons
- Update course content
- Manage Notice Board
- View enrolled students (only his/her course)
- View Reviews

## 👑 Admin Features
- Manage users
- Monitor platform data
- Manage Notice Board
- Monitor Courses

---

# 🛠 Tech Stack

## Frontend
- React
- React Router
- React Icons
- Axios
- Modern CSS

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST API
- CORS

---

# 🗄 Database Collections

The system uses **MongoDB** with the following collections:

- Users
- Courses
- Lessons
- Enrollments
- Reviews
- notification

### Relationships

- **Instructor → creates → Course**
- **Instructor → creates → Lessons**
- **Course → contains → Lessons**
- **Student → enrolls → Course**
- **Student → writes → Review**
- **Enrollment → tracks → Progress**

---

# ⚙️ Requirements

Make sure the following tools are installed on your system:

- Git
- Node.js
- npm
- MongoDB

## 📦 Installation

Clone the repository and install dependencies.

```bash
git clone https://github.com/ranasaad-dev/LMS-Learning-Management-System.git
cd LMS-Learning-Management-System
npm install
```
## 🗄 Start MongoDB

Before starting the project, you must run **MongoDB**.

Open a new terminal and run:

```bash
mongod
```

This will start the MongoDB server in the background or setup your mongo Atlas.

## 🔧 Environment Setup

Go to the backend folder and create the .env file, required example fields:
```
PORT=3000
JWT_SECRET="Anything_random_for_JWT_creation"
MONGO_URI=mongodb://localhost:27017/userDB
VITE_BACKEND_URL=http://localhost:3000/api
EMAIL_USER=user@gmail.com (used for sending otp)
EMAIL_PASS=12345678 (for otp email)
```
Now, Go to the frontend folder and create the .env file, required for services to work correctly. Example:
```
VITE_BACKEND_URL=http://localhost:3000/api
```

## ▶️ Running the Project

#### Start the development server:
In "LMS-Learning-Management-System" directory, run
```
npm run dev
```
The application will start at:

http://localhost:5173

#### Create Admin user:
* To create 'admin' user, Run this curl command:
```
  curl -X POST -H 'Content-Type: application/json' -d '{"name":"Admin","email":"admin@lms.com","password":"12345678","role":"admin"}' http://localhost:3000/api/users
```
This path is intentionally open for creation of Admin. After creating Admin, change a line  in **/backend/routes/userRoutes.js** to this **router.post("/", protect["admin"], userController.createUser);** . Now there is no way to create admin account except using admin token or dashboard.

#### 📡 API Server

Backend API runs on:
http://localhost:3000

#### API Base URL:

http://localhost:3000/api
🔐 Authentication

The system uses JWT authentication.

User Roles

* student
* instructor
* admin

## Protected routes require:

Authentication and Authorization: Bearer TOKEN
📂 Project Structure
```
LMS
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
|   ├── utils
│   ├── middleware
│   └── .env
│
├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
|   ├── utils
│   └── routes
│
└── package.json
```
🎯 Future Improvements

### Upcoming features:
Course search and filters
Video streaming optimization
Payment integration
Google Login
Open Discuession
Course Discussion
Assignments

## 👨‍💻 Author

Rana Saad