# Use Node 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Enable corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

# Generate Prisma Client (set dummy DATABASE_URL for build time)
RUN DATABASE_URL="postgresql://neondb_owner:npg_R9ulEfhSKQ0x@ep-tiny-lake-a9o6jp9s-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require" pnpm prisma:generate

# Build TypeScript
RUN pnpm build

# Copy generated Prisma files to dist to match runtime path aliases
RUN mkdir -p dist/generated && cp -r src/generated/prisma dist/generated/prisma

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server with custom path registration
CMD ["node", "--require", "./register-paths.js", "dist/server.js"]
