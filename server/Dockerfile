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

# Copy the rest of the project
COPY . .

# Generate Prisma Client (set dummy DATABASE_URL for build time)
RUN DATABASE_URL="postgresql://neondb_owner:npg_R9ulEfhSKQ0x@ep-tiny-lake-a9o6jp9s-pooler.gwc.azure.neon.tech/neondb?sslmode=require&channel_binding=require" pnpm prisma:generate

# Build TypeScript
RUN pnpm build

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server using tsconfig-paths for alias resolution
CMD ["pnpm", "start"]
