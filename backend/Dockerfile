FROM node:18-alpine

WORKDIR /usr/src/app

# Copy dependency configs
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy server code
COPY server.js ./

# Set environment
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Run API script
CMD ["node", "server.js"]
