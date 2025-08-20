# Web App Dockerfile
FROM node:20-alpine AS base

LABEL org.opencontainers.source=https://github.com/gokceno/pronto

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

# Copy package files for production dependencies installation
COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/

# Install only production dependencies
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --production=true

# Copy the built application from the base stage
COPY --from=base /app/apps/web/build ./apps/web/build

# Copy the internal packages source code (needed for workspace dependencies)
COPY --from=base /app/packages ./packages

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start the application
CMD ["yarn", "start"]
