# Use Node.js 18
FROM node:18-alpine

# Install TypeScript globally (since your backend is .ts)
RUN npm install -g typescript ts-node

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all source code
COPY . .

# Build frontend (if you have a build step)
RUN npm run build || echo "No build script found, skipping..."

# Expose both ports that your app might use
EXPOSE 3000 3001

# Start your application
# Replace this with however you normally start your app
CMD ["npm", "run", "dev"]