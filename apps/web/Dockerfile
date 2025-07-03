# Web App Dockerfile
FROM oven/bun:1.0 AS base

# Set working directory
WORKDIR /app

# Copy only manifest files first for dependency installation
COPY package.json bun.lock turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/auth/package.json ./packages/auth/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/web/package.json ./apps/web/

# Install dependencies (should be fast and reliable)
RUN bun install

# Now copy the rest of your source code
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Build the application
WORKDIR /app/apps/web
RUN bun run build

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy only manifest files first for dependency installation
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY packages/auth/package.json ./packages/auth/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY apps/web/package.json ./apps/web/

# Install production dependencies
RUN bun install

# Now copy the built output and other necessary files
COPY packages/ ./packages/
COPY apps/web/drizzle.config.js ./apps/web/
COPY apps/web/drizzle/ ./apps/web/drizzle/
COPY apps/web/build/ ./apps/web/build/
COPY apps/web/public/ ./apps/web/public/

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start the application
CMD ["bun", "run", "start"]
