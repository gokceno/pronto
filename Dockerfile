
# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy the entire project with .dockerignore filtering unwanted files
COPY . .

# Install production dependencies
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile

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
CMD ["node", "sync.cli.js", "all"]
