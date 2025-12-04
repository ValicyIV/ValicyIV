# syntax=docker/dockerfile:1
ARG NODE_VERSION=22.13.1

# ---------- Build stage ----------
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Copy package files
COPY package.json ./
# If you add a lockfile later, include it here:
# COPY package*.json ./

# Install deps (use npm install since we may not have package-lock yet)
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy the rest of the app
COPY . .

# Build Next.js app
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# ---------- Production stage ----------
FROM node:${NODE_VERSION}-slim AS final
WORKDIR /app

# Create non-root user for safety
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Copy built app and node_modules from builder
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 3000
# assumes "start": "next start" in package.json
CMD ["npm", "start"]
