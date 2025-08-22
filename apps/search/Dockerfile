
# Production stage
FROM node:20-alpine AS production

LABEL org.opencontainers.source=https://github.com/gokceno/pronto

WORKDIR /app

# Copy the entire project with .dockerignore filtering unwanted files
COPY . .

# Install production dependencies
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile

# Create directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3001

# Start the application
CMD ["yarn", "start:search"]
