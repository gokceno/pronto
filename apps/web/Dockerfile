# Web App Dockerfile
FROM node:20-alpine AS base

LABEL org.opencontainers.source=https://github.com/gokceno/pronto

# Install dependencies and build
WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install all dependencies (including dev dependencies needed for building)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build all packages and the web app using turbo
RUN yarn build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy the entire built project structure from base
COPY --from=base /app .

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Start the application
CMD ["yarn", "start"]
