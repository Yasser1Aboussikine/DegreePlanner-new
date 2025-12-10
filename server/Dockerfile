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

# Build TypeScript
RUN pnpm build

# Copy generated Prisma files into dist so runtime code can find them
RUN cp -r src/generated/prisma dist/generated/prisma

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the server using tsconfig-paths for alias resolution
CMD ["pnpm", "start"]
