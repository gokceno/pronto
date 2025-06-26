# Sync Service Dockerfile
FROM oven/bun:1.0 AS base

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY apps/sync/package.json ./apps/sync/

# Install dependencies (allow lockfile updates)
RUN bun install

# Copy all necessary files
COPY packages/ ./packages/
COPY apps/sync/ ./apps/sync/

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/sync/ ./apps/sync/

# Install production dependencies (allow lockfile updates)
RUN bun install

# Create directory for database
RUN mkdir -p /app/data

# Set working directory to sync app
WORKDIR /app/apps/sync

# Make the CLI executable
RUN chmod +x sync.cli.js

# Default command to sync all data
CMD ["bun", "run", "start"]
