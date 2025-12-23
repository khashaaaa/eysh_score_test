-- Database Schema for Eysh Score Test

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE
);

CREATE TABLE subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  duration INT DEFAULT 3600 -- duration in seconds
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  subject_id INT REFERENCES subjects(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer VARCHAR(10) NOT NULL
);

CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  subject_id INT REFERENCES subjects(id),
  score INT NOT NULL,
  total INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  duration VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE user_packages (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  package_id INT REFERENCES packages(id),
  expiry TIMESTAMP NOT NULL
);

-- Insert subjects
INSERT INTO subjects (name) VALUES
('Англи хэл'),
('Нийгэм'),
('Биологи'),
('Орос хэл'),
('Газарзүй'),
('Түүх'),
('Математик'),
('Физик'),
('Монгол хэл'),
('Хими');

-- Insert packages
INSERT INTO packages (name, duration, price) VALUES
('Monthly Access', '1 month', 10.00),
('Yearly Access', '1 year', 100.00),
('Until Exam', 'until exam', 50.00);