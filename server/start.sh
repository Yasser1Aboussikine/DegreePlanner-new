#!/bin/bash
# Install pnpm if it's not installed
if ! command -v pnpm &> /dev/null
then
    echo "pnpm could not be found, installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
pnpm install

# Run the dev server (as you're using pnpm dev)
pnpm dev