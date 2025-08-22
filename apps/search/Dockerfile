# Build stage
FROM node:20-alpine AS base

LABEL org.opencontainers.source=https://github.com/gokceno/pronto

WORKDIR /app

# Copy package files first for better caching
COPY package.json yarn.lock ./
COPY apps/search/package.json ./apps/search/
COPY packages/auth/package.json ./packages/auth/
COPY packages/db/package.json ./packages/db/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install all dependencies (including dev dependencies needed for turbo)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy the entire project structure from base
COPY --from=base /app .

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Start the application
CMD ["yarn", "start:search"]
