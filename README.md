# Eysh Score Test

## Features

- Email login with OTP verification for users
- Separate admin login with email and password
- JWT authentication
- Exam taking and scoring
- Payment system with QR codes
- Admin panel for managing subjects and questions

## Setup

### Backend

1. Install dependencies: `npm install`
2. Set up PostgreSQL database and run `schema.sql`
3. Set environment variables: DB_USER, DB_PASSWORD, DB_NAME, EMAIL_USER, EMAIL_PASS, JWT_SECRET
4. Run: `npm start`

### Frontend

1. Install dependencies: `npm install`
2. Run: `npm run dev`

## Usage

- User login: Go to /login, enter email, receive OTP, verify
- Admin login: Go to /admin-login, enter email and password
- First admin: Use /auth/admin/register to create admin account

## Database Schema

- users: id, email, password_hash (for admin), is_admin
- otps: email, otp, expires_at, used
- subjects, questions, scores, packages, user_packages

2. Run: `npm start`

## Usage

- Select a subject to take a test
- View scores in chart format
- Purchase access packages
- Admin can add questions

# Admin
curl -X POST http://localhost:3000/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "yourpassword"}'

