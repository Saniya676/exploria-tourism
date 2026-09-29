-- Exploria Tourism Platform - Database Schema (MySQL Compatible)

CREATE DATABASE IF NOT EXISTS exploria_db;
USE exploria_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'GUIDE', 'ADMIN') DEFAULT 'USER',
    avatar VARCHAR(255) DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Guides Profile Table
CREATE TABLE IF NOT EXISTS guides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    experience_years INT DEFAULT 1,
    languages TEXT NOT NULL, -- Stored as JSON or comma separated string
    specializations TEXT NOT NULL, -- Stored as JSON or comma separated string
    hourly_rate DECIMAL(10, 2) DEFAULT 25.00,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    availability_status ENUM('AVAILABLE', 'BUSY', 'UNAVAILABLE') DEFAULT 'AVAILABLE',
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_state VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    best_time VARCHAR(100) NOT NULL,
    estimated_budget DECIMAL(10, 2) NOT NULL,
    popular_activities TEXT NOT NULL, -- Stored as JSON array
    featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 4.80,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Adventures Table
CREATE TABLE IF NOT EXISTS adventures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category ENUM('Hiking', 'Trekking', 'Scuba Diving', 'Paragliding', 'Bungee Jumping', 'Rafting', 'Camping', 'Safari') NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    difficulty ENUM('Easy', 'Moderate', 'Hard', 'Extreme') DEFAULT 'Moderate',
    price DECIMAL(10, 2) NOT NULL,
    best_time VARCHAR(100) NOT NULL,
    safety_info TEXT NOT NULL,
    required_equipment TEXT NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- 5. Packages Table
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    destination_id INT NOT NULL,
    adventure_id INT,
    title VARCHAR(150) NOT NULL,
    cover_image TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_days INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    difficulty ENUM('Easy', 'Moderate', 'Hard', 'Extreme') DEFAULT 'Moderate',
    best_season VARCHAR(100) NOT NULL,
    included_services TEXT NOT NULL, -- JSON array
    excluded_services TEXT NOT NULL, -- JSON array
    max_participants INT DEFAULT 15,
    rating DECIMAL(3, 2) DEFAULT 4.90,
    reviews_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE,
    FOREIGN KEY (adventure_id) REFERENCES adventures(id) ON DELETE SET NULL
);

-- 6. Package Itineraries Table
CREATE TABLE IF NOT EXISTS package_itineraries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    day_number INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- 7. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_id VARCHAR(30) NOT NULL UNIQUE,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    destination_id INT,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE SET NULL
);

-- 8. Guide Matching Requests Table
CREATE TABLE IF NOT EXISTS guide_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    guide_id INT,
    destination VARCHAR(100) NOT NULL,
    travel_dates VARCHAR(100) NOT NULL,
    preferred_activities TEXT NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    travelers_count INT DEFAULT 1,
    special_requirements TEXT,
    status ENUM('PENDING', 'MATCHED', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE SET NULL
);

-- 9. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(30) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    guide_id INT,
    travel_date DATE NOT NULL,
    travelers_count INT NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    payment_status ENUM('PENDING', 'DEMO_PAID', 'FAILED') DEFAULT 'DEMO_PAID',
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE SET NULL
);

-- 10. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT,
    guide_id INT,
    destination_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
);

-- 11. Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_package_unique (user_id, package_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- 12. Guide Availability Table
CREATE TABLE IF NOT EXISTS guide_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guide_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('AVAILABLE', 'BOOKED', 'UNAVAILABLE') DEFAULT 'AVAILABLE',
    FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
);

-- 13. Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);
