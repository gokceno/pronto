# Sync App Dockerfile (Simplified)
FROM oven/bun:1.0 AS base

WORKDIR /app

COPY . .

# Install dependencies
RUN bun install

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

COPY . .

# Install production dependencies
RUN bun install

# Create directory for database
RUN mkdir -p /app/data

WORKDIR /app/apps/sync

# Make the CLI executable
RUN chmod +x sync.cli.js

# Set environment variables if needed
# ENV DB_FILE_NAME=/app/data/pronto.db

# (Optional) Expose port if your sync app serves HTTP
# EXPOSE 3002

# Default command (adjust as needed)
CMD ["bun", "sync.cli.js", "all"]
