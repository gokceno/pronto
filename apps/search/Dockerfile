# Search Service Dockerfile
FROM oven/bun:1.0 AS base

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json bun.lock turbo.json ./
COPY packages/db/package.json ./packages/db/
COPY apps/search/package.json ./apps/search/

# Install dependencies (allow lockfile updates)
RUN bun install

# Copy all necessary files
COPY packages/ ./packages/
COPY apps/search/ ./apps/search/

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy workspace files
COPY package.json bun.lock ./
COPY packages/ ./packages/
COPY apps/search/ ./apps/search/

# Install production dependencies (allow lockfile updates)
RUN bun install

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Set working directory to search app
WORKDIR /app/apps/search

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["bun", "run", "start"]
