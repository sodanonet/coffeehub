# Docker Deployment Guide

This guide covers deploying the CoffeeHub Admin Portal using Docker and Docker Compose.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Docker Architecture](#docker-architecture)
4. [Configuration](#configuration)
5. [Building and Running](#building-and-running)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher (optional, for compose setup)
- At least 2GB of free disk space
- Internet connection for pulling base images

### Verify Installation

```bash
docker --version
docker-compose --version
```

---

## Quick Start

### Using npm Scripts (Easiest)

```bash
# Build the Docker image
npm run docker:build

# Run the container (accessible at http://localhost:8080/)
npm run docker:run

# View container logs
npm run docker:logs

# Stop the container
npm run docker:stop

# Start a stopped container
npm run docker:start

# Remove the container
npm run docker:remove

# Full rebuild (remove, build, and run)
npm run docker:rebuild
```

Access the application at `http://localhost:8080`

### Using Docker Compose

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

Access the application at `http://localhost:8080`

### Using Docker CLI

```bash
# Build the image
docker build -t coffeehub-admin .

# Run the container
docker run -d -p 8080:80 --name coffeehub coffeehub-admin

# View logs
docker logs -f coffeehub

# Stop the container
docker stop coffeehub
docker rm coffeehub
```

Access the application at `http://localhost:8080`

---

## Docker Architecture

### Multi-Stage Build

The Dockerfile uses a two-stage build process:

**Stage 1: Build (Node.js)**
```dockerfile
FROM node:18-alpine AS build
- Installs dependencies (npm ci)
- Includes Tailwind CSS v4 (@tailwindcss/postcss@4.1.14)
- Builds the Angular application with PostCSS processing
- Generates optimized CSS with Tailwind utilities
- Outputs production-ready files to dist/
```

**Stage 2: Serve (Nginx)**
```dockerfile
FROM nginx:alpine
- Copies built files from Stage 1
- Configures Nginx for Angular SPA routing
- Adds security headers (XSS, clickjacking protection)
- Enables gzip compression for all text files
- Sets up health check endpoint
```

### Benefits
- **Smaller Image Size**: Final image only contains compiled assets and Nginx (~50MB vs ~500MB)
- **Security**: No build tools or source code in production image
- **Performance**: Nginx serves static files efficiently
- **CSS Optimization**: Tailwind CSS v4 generates only used utilities
- **Caching**: Separate layers for dependencies and source code
- **Modern Build**: PostCSS with latest Tailwind CSS v4

---

## Configuration

### Environment Variables

Currently, the application uses compile-time configuration. To customize:

1. Edit `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
  // Add other config here
};
```

2. Rebuild the Docker image

**Note**: The application uses Tailwind CSS v4 which is built during the Docker build process. Ensure `postcss.config.js` and `tailwind.config.js` are present.

### Port Configuration

**Default**: Port 80 (container) mapped to 8080 (host)

To change the host port:
```bash
# Docker CLI
docker run -d -p 3000:80 coffeehub-admin

# Docker Compose (edit docker-compose.yml)
ports:
  - '3000:80'
```

### Nginx Configuration

The `nginx.conf` file includes:
- **Gzip Compression**: Reduces transfer size by ~70%
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- **Cache Headers**: 1-year cache for static assets
- **SPA Routing**: All routes serve index.html
- **Health Check**: `/health` endpoint for monitoring

---

## Building and Running

### Development Build

For testing the Docker setup locally:

```bash
# Build with custom tag
docker build -t coffeehub-admin:dev .

# Run with volume mount for logs
docker run -d \
  -p 8080:80 \
  -v $(pwd)/logs:/var/log/nginx \
  --name coffeehub-dev \
  coffeehub-admin:dev
```

### Production Build

```bash
# Build with production tag and version
docker build -t coffeehub-admin:1.0.0 .
docker tag coffeehub-admin:1.0.0 coffeehub-admin:latest

# Run in production mode
docker run -d \
  -p 80:80 \
  --restart unless-stopped \
  --name coffeehub-prod \
  coffeehub-admin:latest
```

### Using Docker Compose

**Development:**
```yaml
# docker-compose.yml
services:
  app:
    build: .
    ports:
      - '8080:80'
    volumes:
      - ./logs:/var/log/nginx
```

**Production:**
```yaml
services:
  app:
    image: coffeehub-admin:latest
    ports:
      - '80:80'
    restart: unless-stopped
```

---

## Production Deployment

### Container Registry

Push to a container registry for deployment:

```bash
# Tag for registry
docker tag coffeehub-admin:latest registry.example.com/coffeehub-admin:1.0.0

# Login to registry
docker login registry.example.com

# Push image
docker push registry.example.com/coffeehub-admin:1.0.0
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Create service
docker service create \
  --name coffeehub \
  --replicas 3 \
  --publish 80:80 \
  coffeehub-admin:latest

# Scale service
docker service scale coffeehub=5

# Update service
docker service update \
  --image coffeehub-admin:1.1.0 \
  coffeehub
```

### Kubernetes

Example Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: coffeehub-admin
spec:
  replicas: 3
  selector:
    matchLabels:
      app: coffeehub
  template:
    metadata:
      labels:
        app: coffeehub
    spec:
      containers:
      - name: coffeehub
        image: coffeehub-admin:latest
        ports:
        - containerPort: 80
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: coffeehub-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: coffeehub
```

### Cloud Platforms

**AWS ECS:**
```bash
# Build and push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.region.amazonaws.com
docker tag coffeehub-admin:latest <account-id>.dkr.ecr.region.amazonaws.com/coffeehub:latest
docker push <account-id>.dkr.ecr.region.amazonaws.com/coffeehub:latest
```

**Google Cloud Run:**
```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/<project-id>/coffeehub
gcloud run deploy coffeehub --image gcr.io/<project-id>/coffeehub --platform managed
```

**Azure Container Instances:**
```bash
# Push to ACR
az acr build --registry <registry-name> --image coffeehub:latest .
az container create --resource-group <rg> --name coffeehub --image <registry>.azurecr.io/coffeehub:latest
```

---

## Health Checks

### Built-in Health Check

The Dockerfile includes a health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
```

### Manual Health Check

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' coffeehub

# Check health endpoint
curl http://localhost:8080/health
# Response: healthy
```

### Monitoring

```bash
# Container stats
docker stats coffeehub

# Logs (follow mode)
docker logs -f coffeehub

# Recent logs
docker logs --tail 100 coffeehub
```

---

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker logs coffeehub
```

**Common issues:**
- Port 8080 already in use: Change port mapping
- Build failed: Check Dockerfile and build output
- Nginx config error: Validate nginx.conf syntax

### Build Failures

**Check Tailwind CSS configuration:**
```bash
# Verify files exist
ls -la postcss.config.js tailwind.config.js src/styles.css

# Verify Tailwind packages are installed
docker run --rm node:18-alpine sh -c "cd /app && npm list tailwindcss @tailwindcss/postcss"
```

**Clear Docker cache:**
```bash
docker builder prune -a
```

**Build without cache:**
```bash
docker build --no-cache -t coffeehub-admin .
```

**Check disk space:**
```bash
docker system df
docker system prune -a
```

### Application Not Loading

**Check if container is running:**
```bash
docker ps
```

**Verify port mapping:**
```bash
docker port coffeehub
```

**Test Nginx:**
```bash
docker exec coffeehub nginx -t
```

**Check browser:**
- Clear browser cache
- Try incognito mode
- Check browser console for errors

### Performance Issues

**Increase resources:**
```bash
# Docker Desktop: Increase memory/CPU in settings

# Docker Compose
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

**Enable logging:**
```bash
docker logs --details coffeehub
```

---

## Optimization Tips

### Build Optimization

1. **Use .dockerignore**
   - Excludes unnecessary files from build context
   - Speeds up build time

2. **Layer Caching**
   - Copy package.json before source code
   - Dependencies cached until package.json changes

3. **Multi-stage Build**
   - Keeps final image small
   - Only production dependencies included

### Runtime Optimization

1. **Gzip Compression**
   - Enabled in nginx.conf
   - Reduces bandwidth by ~70%

2. **Static Asset Caching**
   - 1-year cache for immutable assets
   - Browser caches files locally

3. **Health Checks**
   - Monitors container health
   - Automatic restart on failure

---

## Security Best Practices

1. **Non-root User**
   - Consider running Nginx as non-root user
   - Add USER directive in Dockerfile

2. **Security Headers**
   - X-Frame-Options prevents clickjacking
   - X-Content-Type-Options prevents MIME sniffing
   - X-XSS-Protection adds XSS protection

3. **Regular Updates**
   - Keep base images updated
   - Rebuild images monthly

4. **Secret Management**
   - Use Docker secrets for sensitive data
   - Never hardcode credentials

---

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t coffeehub-admin .

      - name: Push to registry
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker push coffeehub-admin:latest
```

### GitLab CI

```yaml
build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t coffeehub-admin .
    - docker push coffeehub-admin:latest
```

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

---

**Questions or Issues?**

For deployment questions or issues, please check:
1. Container logs: `docker logs coffeehub`
2. Health check status: `docker inspect coffeehub`
3. Nginx configuration: `docker exec coffeehub nginx -t`
