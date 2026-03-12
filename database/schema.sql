-- Database: jashan_jewellers

-- Drop tables if they exist to ensure a clean slate for development/migrations
DROP TABLE IF EXISTS custom_requests;
DROP TABLE IF EXISTS jewellery;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Users table for authentication (e.g., admin users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table for jewellery types
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon_url VARCHAR(255), -- URL for a category icon/image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Jewellery table for catalogue items
CREATE TABLE jewellery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    design_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    metal_type ENUM('Gold', 'Silver') NOT NULL,
    expected_weight_min DECIMAL(10,2), -- in grams
    expected_weight_max DECIMAL(10,2), -- in grams
    image_url VARCHAR(255),
    category_id INT NOT NULL,
    occasion ENUM('Daily Wear', 'Wedding', 'Party Wear', 'Traditional'),
    is_trending BOOLEAN DEFAULT FALSE,
    is_bridal BOOLEAN DEFAULT FALSE,
    is_lightweight BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Custom Requests table
CREATE TABLE custom_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    jewellery_type VARCHAR(100) NOT NULL,
    expected_weight VARCHAR(100), -- Can be a range or descriptive text
    design_image_url VARCHAR(255), -- URL for uploaded design image
    message TEXT,
    status ENUM('Pending', 'In Progress', 'Completed', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for faster lookups
CREATE INDEX idx_jewellery_metal_type ON jewellery(metal_type);
CREATE INDEX idx_jewellery_category_id ON jewellery(category_id);
CREATE INDEX idx_jewellery_occasion ON jewellery(occasion);
CREATE INDEX idx_jewellery_trending ON jewellery(is_trending);
CREATE INDEX idx_jewellery_bridal ON jewellery(is_bridal);
CREATE INDEX idx_jewellery_lightweight ON jewellery(is_lightweight);
CREATE INDEX idx_custom_requests_phone_number ON custom_requests(phone_number);
CREATE INDEX idx_custom_requests_status ON custom_requests(status);