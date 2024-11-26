# Base image with Node.js
FROM node:lts-alpine AS base

# Install dependencies needed for building the project
FROM base AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# Install compatibility libraries
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package manager files and install pnpm
COPY package.json pnpm-lock.yaml ./
# RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of the application code
COPY . .
# RUN npm install -g pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Generate Prisma client
RUN pnpx prisma generate

# Build the Next.js application
RUN pnpm build

# Create the production image
FROM base AS runner
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the necessary files and directories from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma /app/prisma

# Set permissions
RUN chown nextjs:nodejs .next

# Switch to non-root user
USER nextjs

# Expose the application's port
EXPOSE 3000

# Command to run the application
CMD ["node", "server.js"]