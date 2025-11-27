# User Management Web App

A simple web app for managing users with admin and student roles.

---

## Features

*   User registration and login
*   Admin and student roles
*   Admins can create, edit, and delete users
*   Students have a simple dashboard
*   Users can change their password
*   Secure password hashing and session management

---

## Technology Stack

*   **Backend**: Node.js, Express.js
*   **Frontend**: EJS (Embedded JavaScript templates), HTML, CSS
*   **Database**: SQLite
*   **Authentication**: express-session, bcrypt
*   **Environment Variables**: dotenv

---

## Setup Instructions

### 1. Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### 2. Clone the Repository

```bash
git clone <repository-url>
cd user-management-web-app
```

### 3. Install Dependencies

Navigate to the project's root folder in your terminal and run:

```bash
npm install
```

### 4. Environment Variables

The application uses a `.env` file to manage environment variables. Create a file named `.env` in the root of the project and add the following variable. This is used to secure user sessions.

```
SESSION_SECRET=your_super_secret_key_here
```

### 5. Database Setup

The project uses a file-based SQLite database. The database file (`database.sqlite`) will be automatically created inside the `db/` directory the first time you start the server. The database is also automatically seeded with a default admin user.

### 6. Start the Server

Once the dependencies are installed and the `.env` file is configured, you can start the server with:

```bash
npm start
```

The backend will run at `http://127.0.0.1:3000`.

---

## Usage Guide

1.  **Access the Application**:
    Open your web browser and navigate to `http://localhost:3000`.

2.  **Admin Login**:
    Use the default administrator credentials to log in:
    -   **Username**: `admin`
    -   **Password**: `adminpassword`

3.  **Register New Users**:
    You can register new users (with the `student` role) through the registration page.
