FROM oven/bun:1.0 AS base

WORKDIR /app

# Copy only the root and sync package manifests first
COPY package.json bun.lock turbo.json ./
COPY apps/sync/package.json ./apps/sync/
COPY packages/db/package.json ./packages/db/

# Install dependencies (this should be fast and not hang)
RUN bun install

# Now copy the rest of your source code
# Now copy the rest of your source code
COPY packages/ ./packages/
COPY apps/sync/ ./apps/sync/

# Production stage
FROM oven/bun:1.0 AS production

WORKDIR /app

# Copy only manifest files first for dependency installation
COPY package.json bun.lock ./
COPY packages/db/package.json ./packages/db/
COPY apps/sync/package.json ./apps/sync/

# Install production dependencies
RUN bun install

# Now copy the rest of your source code
COPY packages/ ./packages/
COPY apps/sync/ ./apps/sync/

RUN mkdir -p /app/data

WORKDIR /app/apps/sync

RUN chmod +x sync.cli.js
