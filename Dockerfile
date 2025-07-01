# Use Node.js 22-slim to match Smithery deployment
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npx tsc

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force

# Expose port (if needed for testing)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"] 