# Specify a base image
FROM oven/bun AS builder

# Set working directory for dependencies
WORKDIR /usr/app

# Install Turbo globally
RUN bun add -g turbo

# Copy the entire workspace context
COPY . .

# Prune workspace for web app
RUN turbo prune --scope=web --docker

LABEL app="pronto-web"
LABEL org.opencontainers.image.source="https://github.com/gokceno/pronto"

# Install dependencies for the whole monorepo
RUN bun install --network-timeout=100000

# Build the web app
RUN bun run build --filter=web

# Stage 2: Final Image
FROM oven/bun

# Set working directory
WORKDIR /usr/app

# Copy built files from builder stage
COPY --from=builder /usr/app /usr/app

# Expose the port your app runs on
EXPOSE 3000

# Start your app
CMD ["bun", "run", "start", "--filter=web"]
