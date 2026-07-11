# 🎬 Movie Ticket Booking System API

> A complete **Movie Ticket Booking System Backend API** built with **Node.js, Express.js, MongoDB, Mongoose, JWT, and Nodemailer** that allows users to browse movies, book tickets, manage bookings, and enables administrators to manage movies, theaters, and reports through secure Role-Based Access Control (RBAC).

<p align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,javascript,git,github,vscode" />
</p>

---

# 📖 Project Overview

The **Ticket Booking System API** is designed to simplify movie ticket booking by providing secure REST APIs for users and administrators.

Users can register, verify their email, browse available movies, book tickets, cancel bookings, and view booking history.

Administrators can manage movies, theaters, show timings, and generate booking reports.

---

# ✨ Features

## 🔐 Authentication

- User Signup
- Email Verification
- Secure Login
- JWT Authentication
- Role-Based Authorization
- Password Encryption using bcrypt

---

## 👤 User Management

- Register User
- Login
- Get User Profile
- Update User Profile
- Upload Profile Picture
- Email Verification

---

## 🎥 Movie Management

- Add Movie
- Update Movie
- Delete Movie
- View All Movies
- Movie Details
- Movie Show Timings

---

## 🏢 Theater Management

- Add Theater
- Update Theater
- Delete Theater
- Assign Movies to Screens
- Manage Show Timings

---

## 🎟 Booking Management

- Book Tickets
- Cancel Booking
- View Booking History
- Seat Availability Management

---

## 📊 Reports

- Movie Booking Report
- Theater Booking Report
- Booking Summary Email

---

# 🔐 Roles

| Role | Permissions |
|------|-------------|
| Admin | Full Access |
| User | Browse Movies & Book Tickets |

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password Hashing |
| Nodemailer | Email Verification & Reports |
| Multer | File Upload |
| dotenv | Environment Variables |
| Morgan | Request Logging |
| Joi / Express Validator | Request Validation |

---

# 📂 Project Structure

```text
TicketBookingAPI/
│
├── app/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── emailVerify.js
│   │
│   ├── controller/
│   │   ├── auth.controller.js
│   │   ├── booking.controller.js
│   │   ├── movie.controller.js
│   │   ├── report.controller.js
│   │   ├── theater.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/
│   │   ├── allowRoles.js
│   │   └── auth.js
│   │
│   ├── model/
│   │   ├── bookingModel.js
│   │   ├── movieModel.js
│   │   ├── otpModel.js
│   │   ├── roleModel.js
│   │   ├── showModel.js
│   │   ├── theaterModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── book.routes.js
│   │   ├── movie.routes.js
│   │   ├── report.routes.js
│   │   ├── theater.routes.js
│   │   ├── user.routes.js
│   │   └── index.js
│   │
│   └── utils/
│       ├── httpStatusCode.js
│       ├── logger.js
│       ├── sendBookingDetails.js
│       └── sendEmail.js
│
├── Postman/
│   └── TicketBooking.postman_collection.json
│
├── public/
├── uploads/
├── views/
│
├── .env
├── .gitignore
├── app.js
├── combined.log
├── error.log
└── README.md
```

---

# 🗄 Database Collections

```
Users
Roles
Movies
Theaters
Shows
Bookings
OTP
```

---

# 🚀 API Modules

## 🔐 Authentication

```http
POST   /auth/signup
GET    /auth/verify/:token
POST   /auth/login
```

---

## 👤 Users

```http
GET    /users/profile
PUT    /users/profile
```

---

## 🎥 Movies

```http
POST   /movies
GET    /movies
GET    /movies/:id
PUT    /movies/:id
DELETE /movies/:id
```

---

## 🏢 Theaters

```http
POST   /theaters
GET    /theaters
PUT    /theaters/:id
DELETE /theaters/:id

POST   /theaters/assign-movie
```

---

## 🎟 Bookings

```http
GET    /bookings/theaters/:movieId

POST   /bookings

DELETE /bookings/:bookingId

GET    /bookings/history
```

---

## 📊 Reports

```http
GET    /reports/movie-bookings

GET    /reports/theater-bookings

POST   /reports/send-booking-summary
```

---

# 🎬 Workflow

### User Journey

```
Signup
      │
      ▼
Email Verification
      │
      ▼
Login
      │
      ▼
Browse Movies
      │
      ▼
Choose Theater
      │
      ▼
Select Show Timing
      │
      ▼
Book Tickets
      │
      ▼
Booking Confirmation
      │
      ▼
View Booking History
```

---

### Admin Journey

```
Login
      │
      ▼
Manage Movies
      │
      ▼
Manage Theaters
      │
      ▼
Assign Movies to Screens
      │
      ▼
Manage Shows
      │
      ▼
Generate Reports
```

---

# 📧 Email Features

✅ Email Verification

✅ Booking Confirmation Email

✅ Booking Summary Report

✅ HTML Table Email

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Role-Based Authorization
- Protected Routes
- Input Validation
- File Upload Support
- Request Logging
- Secure Environment Variables

---

# 📈 Reports

### Movie Booking Report

- Movie Name
- Total Bookings
- Total Tickets Sold

---

### Theater Booking Report

- Theater Name
- Movie Name
- Show Timing
- Tickets Booked

---

### Booking Summary Email

Includes:

- Movie Name
- Theater
- Screen Number
- Show Timing
- Number of Tickets
- Booking Date

Delivered as an HTML table directly to the user's registered email.

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/ticket-booking-api.git
```

---

## Navigate into Project

```bash
cd ticket-booking-api
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment Variables

Create a **.env** file.

```env
PORT=5000

MONGO_URI=

JWT_SECRET=

EMAIL=

EMAIL_PASSWORD=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## Run Project

Development

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 📮 Postman Collection

A complete Postman collection is included in the project.

```
Postman/
    TicketBooking.postman_collection.json
```

Import the collection into **Postman** to test every API endpoint.

---

# 🎯 Modules Covered

- ✅ User Authentication
- ✅ Email Verification
- ✅ User Profile Management
- ✅ Movie Management
- ✅ Theater Management
- ✅ Show Scheduling
- ✅ Ticket Booking
- ✅ Booking Cancellation
- ✅ Booking History
- ✅ Booking Reports
- ✅ Booking Summary Email

---

# 🚀 Future Enhancements

- Seat Selection with Interactive Layout
- Online Payment Gateway Integration
- QR Code Based Ticket
- Ticket Download (PDF)
- Movie Reviews & Ratings
- Search & Filters
- Wishlist
- Notification System
- Admin Dashboard Analytics
- Swagger API Documentation

---

# 👨‍💻 Author

**Srinu**

Backend Developer

Built with ❤️ using **Node.js, Express.js & MongoDB**
