# Jashan Jewellers - Premium Jewellery Catalogue

Welcome to Jashan Jewellers, a modern, premium online catalogue for a family jewellery business specializing in custom Gold and Silver jewellery. This application is designed to showcase exquisite jewellery designs, allow customers to browse efficiently, and facilitate direct inquiries without any e-commerce functionality.

## Table of Contents

1.  [Project Overview](#project-overview)
2.  [Features](#features)
3.  [Technology Stack](#technology-stack)
4.  [Local Development Setup](#local-development-setup)
    *   [Prerequisites](#prerequisites)
    *   [Database Setup](#database-setup)
    *   [Backend Setup](#backend-setup)
    *   [Frontend Setup](#frontend-setup)
5.  [Authentication & Authorization (Admin)](#authentication--authorization-admin)
6.  [API Endpoints](#api-endpoints)
7.  [Testing](#testing)
8.  [Deployment](#deployment)
    *   [Docker](#docker)
    *   [CI/CD](#cicd)
9.  [Project Structure](#project-structure)
10. [Design & UI Highlights](#design--ui-highlights)
11. [License](#license)

## Project Overview

Jashan Jewellers provides a luxurious and elegant browsing experience for potential customers. It focuses on showcasing Gold and Silver jewellery, offering detailed views, and enabling direct contact for custom orders or inquiries. The website explicitly excludes all e-commerce features (cart, checkout, buy now) to maintain its catalogue-only nature.

## Features

*   **Premium UI/UX:** Luxury design, elegant product cards, gold hover effects, smooth animations.
*   **Catalogue Browsing:** Browse Gold and Silver jewellery designs by category.
*   **Advanced Filters:** Filter jewellery by type, metal, weight, and occasion.
*   **Design Details:** View detailed information for each jewellery piece.
*   **Custom Jewellery Requests:** Dedicated section and form to request custom designs.
*   **Contact & Inquiry:** Clear display of shop contact details, WhatsApp and Call buttons for direct inquiries.
*   **Admin Panel (Backend Only):** Secure API endpoints for managing jewellery, categories, and custom requests (requires authentication).
*   **Responsive Design:** Fully optimized for mobile and desktop devices.
*   **Security:** JWT authentication, input validation, CORS, and security headers.
*   **Robust Backend:** Node.js with Express, MySQL database.

## Technology Stack

*   **Frontend:** HTML5, CSS3 (with custom styles for luxury feel), JavaScript (ES6+)
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL
*   **Authentication:** JSON Web Tokens (JWT), Bcrypt for password hashing
*   **Validation:** Joi
*   **Security:** Helmet, CORS
*   **Testing:** Mocha, Chai, Supertest
*   **Deployment:** Docker, Docker Compose

## Local Development Setup

### Prerequisites

Ensure you have the following installed on your machine:

*   Node.js (LTS version)
*   npm (comes with Node.js)
*   MySQL Server (version 8.0+)
*   Docker & Docker Compose (optional, for containerized deployment)

### Database Setup

1.  **Create Database:**
    Connect to your MySQL server (e.g., using `mysql -u root -p`) and create the database:
    ```sql
    CREATE DATABASE jashan_jewellers;
    USE jashan_jewellers;
    ```

2.  **Run Schema and Seed Data:**
    Navigate to the `database/` directory:
    ```bash
    cd database
    mysql -u root -p jashan_jewellers < schema.sql
    mysql -u root -p jashan_jewellers < seed_data.sql
    ```
    *   `schema.sql` creates the necessary tables.
    *   `seed_data.sql` populates the database with initial categories, jewellery, and an admin user.

### Backend Setup

1.  **Navigate to Backend Directory:**
    ```bash
    cd backend/src
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the `backend/src` directory by copying `.env.example` and filling in your details:
    ```
    # .env example
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_root_password
    DB_NAME=jashan_jewellers
    JWT_SECRET=supersecretjwtkey
    JWT_EXPIRES_IN=1h
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=adminpassword123
    ```
    *   **Important:** Replace `your_mysql_root_password` with your actual MySQL root password. For production, use stronger, randomly generated secrets.

4.  **Start Backend Server:**
    ```bash
    npm start
    ```
    The backend server will start on `http://localhost:5000` (or your specified `PORT`).

### Frontend Setup

1.  **Navigate to Frontend Directory:**
    ```bash
    cd frontend/src
    ```

2.  **Open `index.html`:**
    Simply open the `index.html` file in your web browser. There is no build step required for this plain HTML/CSS/JS frontend.

    *   **Note:** For local development, ensure your browser allows `fetch` requests to `http://localhost:5000` from a `file://` URL. Sometimes, CORS policies might restrict this. For a more robust local setup, you might use a simple HTTP server (like `live-server` npm package) to serve the frontend:
        ```bash
        # In frontend/src directory
        npm install -g live-server
        live-server
        ```
        This will open the frontend in your browser, typically at `http://127.0.0.1:8080`.

## Authentication & Authorization (Admin)

The backend includes an admin user for managing catalogue data.

*   **Login Endpoint:** `POST /api/auth/login`
    *   **Body:** `{ "username": "admin", "password": "adminpassword123" }` (or whatever you set in `.env`)
    *   **Response:** `{ "token": "your_jwt_token" }`
*   **Authorized Access:** Include the `token` in the `Authorization` header as a Bearer token for protected routes (e.g., `Bearer YOUR_JWT_TOKEN`).
*   **Protected Routes:**
    *   `POST /api/jewellery`
    *   `PUT /api/jewellery/:id`
    *   `DELETE /api/jewellery/:id`
    *   `POST /api/categories`
    *   `PUT /api/categories/:id`
    *   `DELETE /api/categories/:id`

## API Endpoints

**Authentication**
*   `POST /api/auth/register` (Admin user creation - intended for initial setup, disable/remove in production)
*   `POST /api/auth/login` (Admin login)

**Jewellery**
*   `GET /api/jewellery` - Get all jewellery items (with optional filters: `category`, `metal`, `weight_range`, `occasion`)
*   `GET /api/jewellery/:id` - Get a single jewellery item by ID
*   `POST /api/jewellery` - Create a new jewellery item (Admin only)
*   `PUT /api/jewellery/:id` - Update a jewellery item (Admin only)
*   `DELETE /api/jewellery/:id` - Delete a jewellery item (Admin only)

**Categories**
*   `GET /api/categories` - Get all jewellery categories
*   `GET /api/categories/:id` - Get a single category by ID
*   `POST /api/categories` - Create a new category (Admin only)
*   `PUT /api/categories/:id` - Update a category (Admin only)
*   `DELETE /api/categories/:id` - Delete a category (Admin only)

**Custom Requests**
*   `POST /api/custom-requests` - Submit a new custom jewellery request
*   `GET /api/custom-requests` - Get all custom requests (Admin only)
*   `GET /api/custom-requests/:id` - Get a single custom request by ID (Admin only)
*   `PUT /api/custom-requests/:id` - Update a custom request (Admin only, e.g., to mark as processed)
*   `DELETE /api/custom-requests/:id` - Delete a custom request (Admin only)

## Testing

### Backend Tests

1.  **Navigate to Backend Directory:**
    ```bash
    cd backend/src
    ```
2.  **Run Tests:**
    ```bash
    npm test
    ```
    This will run unit and integration tests using Mocha, Chai, and Supertest.
    *Note: Ensure you have a test database configured or that your `DB_NAME` in `.env` points to a database you're comfortable clearing for testing purposes.*

### Frontend Tests

A placeholder `frontend/tests/example.test.js` is provided. For a plain HTML/CSS/JS application, comprehensive automated frontend testing typically involves browser-based tools like Cypress or Selenium, which are beyond the scope of this initial setup but can be integrated.

## Deployment

### Docker

The project includes `Dockerfile` and `docker-compose.yml` for containerizing the application.

1.  **Build and Run with Docker Compose:**
    From the project root directory:
    ```bash
    docker-compose up --build
    ```
    This will:
    *   Build the Node.js backend image.
    *   Set up a MySQL container.
    *   Connect the backend to the database.
    *   The frontend (plain HTML/CSS/JS) is served by the backend's static file server.
    *   The application will be accessible at `http://localhost:5000`.

2.  **Stop Docker Containers:**
    ```bash
    docker-compose down
    ```

### CI/CD

A basic GitHub Actions workflow example (`.github/workflows/deploy.yml`) is provided as a starting point for continuous integration and deployment. It demonstrates how to lint, test, and potentially deploy the application upon pushes to the `main` branch.


## Project Structure


## Design & UI Highlights

The frontend is designed to evoke a sense of luxury and elegance, akin to high-end jewellery brands.

*   **Color Palette:** Dominated by `#C9A227` (Primary Gold), `#0F0F0F` (Black), and White/Cream backgrounds.
*   **Typography:** Elegant serif fonts for headings (e.g., Playfair Display via Google Fonts) and clean sans-serif for body text (e.g., Poppins via Google Fonts).
*   **Hero Section:** Features a dynamically rotating 3D-like "JJ" logo, shop name, and a compelling tagline, all set against a sophisticated background.
*   **Navigation:** Sticky navigation bar with subtle gold hover effects and a search bar.
*   **Product Cards:** Elegant layout with high-quality image placeholders, design codes, weight ranges, and direct inquiry buttons.
*   **Advanced Filters:** Intuitive left-side filter panel for an enhanced browsing experience.
*   **Responsive:** The layout is designed using CSS Flexbox and Media Queries to ensure a seamless experience across all devices.
*   **Floating Contact Buttons:** Always accessible WhatsApp and Call buttons for instant communication.

## License

This project is open-sourced under the MIT License. See the LICENSE file for more details.