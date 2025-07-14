# Root Dockerfile for Database Operations (Simplified)
FROM oven/bun:1.0 AS base

WORKDIR /app

COPY . .

# Install dependencies
RUN bun install

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy the entire project context again for production image
COPY . .

# Install production dependencies
RUN bun install

# Create directory for database
RUN mkdir -p /app/data

# Set working directory to sync app
WORKDIR /app/apps/sync

# Make the CLI executable
RUN chmod +x sync.cli.js

# Environment variables
ENV DB_FILE_NAME=/app/data/pronto.db

# Expose volume for database
VOLUME ["/app/data"]

# Default command to initialize and maintain database
CMD ["bun", "sync.cli.js", "all"]
