# Web App Dockerfile
FROM oven/bun:1.0 AS base

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/auth/package.json ./packages/auth/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/web/package.json ./apps/web/

# Install dependencies (allow lockfile updates)
RUN bun install

# Copy all necessary files
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Build the application
WORKDIR /app/apps/web
RUN bun run build

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/
COPY apps/web/drizzle.config.js ./apps/web/
COPY apps/web/drizzle/ ./apps/web/drizzle/
COPY apps/web/build/ ./apps/web/build/
COPY apps/web/public/ ./apps/web/public/

# Install production dependencies (allow lockfile updates)
RUN bun install

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start the application
CMD ["bun", "run", "start"]
