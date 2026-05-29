# =========================================================
# Stage 1: Build the React Application
# =========================================================
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install packages
RUN npm install

# Copy source code files
COPY . .

# Compile optimized static bundle
RUN npm run build

# =========================================================
# Stage 2: Serve using Nginx Web Server
# =========================================================
FROM nginx:1.25-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets from compile stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
