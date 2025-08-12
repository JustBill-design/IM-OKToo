FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start backend server
CMD ["npm", "run", "dev"]