
FROM oven/bun:1.0 AS base

WORKDIR /app

# Copy the entire project context, .dockerignore will handle exclusions
COPY . .

# Install dependencies
RUN bun install

# Build the application
WORKDIR /app/apps/web
ENV NODE_ENV=production
ENV NODE_OPTIONS=--conditions=node
RUN bun install --no-cache
RUN bun run build

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy the entire project context again for production image
COPY . .

ENV NODE_ENV=production
ENV NODE_OPTIONS=--conditions=node
RUN bun install --no-cache

WORKDIR /app/apps/web

EXPOSE 3000

CMD ["bun", "run", "start"]
