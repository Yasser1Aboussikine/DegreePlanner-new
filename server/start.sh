#!/bin/bash
# Install pnpm if it's not installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm could not be found, installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Build the TypeScript code
pnpm build

# Start the production server
pnpm dev