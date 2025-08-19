# Web App Dockerfile
FROM node:20-alpine AS base

# Install dependencies and build
WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/

# Install all dependencies (including dev dependencies needed for drizzle-kit)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the web app
WORKDIR /app/apps/web
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy the entire project with .dockerignore filtering unwanted files
COPY . .

# Install all dependencies (including dev dependencies for drizzle-kit migration)
RUN yarn install --frozen-lockfile

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start the application
CMD ["yarn", "start"]
