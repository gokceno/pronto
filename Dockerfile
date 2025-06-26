# Use Bun as the base image
FROM oven/bun:1.0.0 as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./
COPY turbo.json ./

# Copy workspace package files
COPY apps/web/package.json ./apps/web/
COPY apps/search/package.json ./apps/search/
COPY apps/sync/package.json ./apps/sync/
COPY packages/*/package.json ./packages/*/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build stage
FROM base as build

# Build the applications
RUN bun run build

# Production stage for web app
FROM base as web
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["bun", "run", "start", "--filter=web"]

# Production stage for search service
FROM base as search
WORKDIR /app
COPY --from=build /app .
EXPOSE 3001
CMD ["bun", "run", "search:start"]

# Development stage
FROM base as dev
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000 3001

LABEL org.opencontainers.source=https://github.com/gokceno/pronto

CMD ["bun", "run", "dev"]
