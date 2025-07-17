# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Accept build-time environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_SOCKET_URL

# Set environment variables so Next.js can access them during build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

ENV NODE_ENV=production

# Copy package manager files and install deps
COPY pnpm-lock.yaml package.json ./
RUN pnpm install

# Copy source and build
COPY . .
RUN pnpm build

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/.next/ ./.next/
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose and run
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "start"]
