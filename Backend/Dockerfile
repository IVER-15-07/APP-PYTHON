## Multi-stage for JS backend: install all deps in builder, generate Prisma client,
## prune dev dependencies, and copy to a minimal production image.

FROM node:20-alpine AS builder
WORKDIR /app

# Install system build tools needed by some native deps or prisma
RUN apk add --no-cache python3 make g++

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including dev) so we can run prisma generate
RUN npm ci

# Copy rest of source
COPY . .

# Generate Prisma client (if prisma schema exists)
RUN if [ -d "prisma" ]; then npx prisma generate || true; fi

# Remove devDependencies to keep production node_modules small
RUN npm prune --production

### Production image
FROM node:20-alpine
WORKDIR /app

# Minimal runtime deps
RUN apk add --no-cache libc6-compat

# Copy production node_modules and app code from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Create non-root user and set ownership
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget -qO- --timeout=2 http://localhost:3000/health || exit 1

CMD ["node", "index.js"]
