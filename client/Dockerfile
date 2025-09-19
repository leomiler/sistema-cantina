# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Create non-root user
RUN addgroup -g 1001 -S nginx-custom
RUN adduser -S nginx-custom -u 1001

# Set ownership
RUN chown -R nginx-custom:nginx-custom /usr/share/nginx/html
RUN chown -R nginx-custom:nginx-custom /var/cache/nginx
RUN chown -R nginx-custom:nginx-custom /var/log/nginx
RUN chown -R nginx-custom:nginx-custom /etc/nginx/conf.d

# Change nginx user
RUN sed -i 's/user nginx;/user nginx-custom;/' /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]