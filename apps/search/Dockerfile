# Search Service Dockerfile (Simplified)

FROM oven/bun:1.0 AS base

WORKDIR /app

COPY . .

# Install dependencies
RUN bun install

# Build step (if needed, add your build commands here)
# For example, if you have a build script:
# WORKDIR /app/apps/search
# RUN bun run build

FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy the entire project again for the production image
COPY . .

# Install production dependencies
RUN bun install --no-cache

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
