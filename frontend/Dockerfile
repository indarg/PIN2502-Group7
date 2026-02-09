# Build stage
FROM node:20-alpine as build
ENV APP_PATH=/opt/web/motorizando
WORKDIR $APP_PATH

# Copy source code
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /opt/web/motorizando/dist /usr/share/nginx/html


# Copy custom nginx configuration to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set correct permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

