# Stage 1: Build the Node.js backend
FROM node:18-alpine AS builder

WORKDIR /app/backend/src

# Copy package.json and package-lock.json first to leverage Docker cache
COPY backend/src/package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the application source code
COPY backend/src .

# Stage 2: Create the final production image
FROM node:18-alpine

WORKDIR /app

# Copy production dependencies from builder stage
COPY --from=builder /app/backend/src/node_modules ./backend/src/node_modules

# Copy backend source code
COPY backend/src ./backend/src

# Copy frontend static files (index.html, css, js)
COPY frontend/src ./frontend/src

# Expose the port the app runs on
EXPOSE 5000

# Set environment variables for the backend
ENV NODE_ENV=production
ENV PORT=5000

# Define the command to run your app
CMD ["node", "backend/src/server.js"]