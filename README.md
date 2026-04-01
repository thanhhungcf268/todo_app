# 🚀 Fullstack Task Management System

## 📌 Overview
This is a fullstack task management system built with **Node.js (Express) and ReactJS**.  
The project focuses on building a scalable backend with authentication, authorization, and clean architecture using middleware.

---

## 🛠 Tech Stack

### Backend
- Node.js (Express)
- MongoDB
- JWT Authentication
- Middleware architecture

### Frontend
- ReactJS
- Axios (API communication)

---

## 🔥 Key Features

### 🔐 Authentication & Authorization
- User registration & login using JWT
- Secure API with token-based authentication
- Role-based permission control (authorization)

---

### ⚙️ Backend Architecture
- Structured using **middleware pattern**
- Separation of concerns (routes → middleware → controller)
- Centralized error handling

---

### 📦 Task Management
- Create / Update / Delete tasks
- Filter & manage task list
- Clean RESTful API design

---

### 🛡 Validation & Error Handling
- Input validation for API requests
- Consistent error response structure
- Prevent invalid data from entering system

---

## 🧠 System Design Highlights

- Designed API with **scalability in mind**
- Applied **middleware chain** to handle:
  - authentication
  - authorization
  - error handling
- Used **JWT (stateless)** to simplify scaling

---

## 🔄 API Flow

Client → API Request → Middleware (Auth / Permission)  
       → Controller → Database → Response

---

## 🚀 Getting Started

### 1. Install dependencies
npm install

### 2. Run backend
npm run dev

### 3. Run frontend
npm start

---

## 🎯 What I Learned

- Implementing authentication & authorization using JWT  
- Designing backend using middleware architecture  
- Handling real-world scenarios like validation & error handling  
- Structuring code for scalability and maintainability  

---

## 🚧 Future Improvements

- Add message queue for async processing (e.g. notifications)
- Implement caching (Redis)
- Improve performance & monitoring
- Add real-time features (WebSocket)
