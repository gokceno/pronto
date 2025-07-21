# Web App Dockerfile
FROM node:20-alpine AS base

# Build the application
WORKDIR /app/apps/web
ENV NODE_ENV=production
ENV NODE_OPTIONS=--conditions=node
RUN yarn install --frozen-lockfile && yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy the entire project with .dockerignore filtering unwanted files
COPY . .

# Install production dependencies
ENV NODE_ENV=production
ENV NODE_OPTIONS=--conditions=node
RUN yarn install --frozen-lockfile

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start the application
CMD ["yarn", "start"]
