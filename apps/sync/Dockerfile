# Specify a base image
FROM oven/bun AS builder

# Set working directory for dependencies
WORKDIR /usr/app

# Install Turbo globally
RUN bun add -g turbo

# Copy the entire workspace context
COPY . .

# Prune workspace for sync app
RUN turbo prune --scope=sync --docker

LABEL app="pronto-sync"
LABEL org.opencontainers.image.source="https://github.com/gokceno/pronto"

# Install dependencies for the whole monorepo
RUN bun install --network-timeout=100000

# Build the sync app (if needed)
RUN bun run build --filter=sync || echo "No build step required for sync service"

# Stage 2: Final Image
FROM oven/bun

# Set working directory
WORKDIR /usr/app

# Copy built files from builder stage
COPY --from=builder /usr/app /usr/app

# Expose the port your app runs on (if needed)
EXPOSE 3002

# Start your app
CMD ["bun", "run", "start", "--filter=sync"]
