# Food Delivery Application - Deployment Guide

This guide will help you deploy the Food Delivery application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git (optional, for cloning the repository)

## Project Structure

```
foodDelivery/
├── frontend/          # Next.js frontend application
├── node-backend/      # Node.js/Express backend API
├── nginx/             # Nginx reverse proxy configuration
└── docker-compose.yml # Docker Compose orchestration file
```

## Quick Start

### 1. Clone/Navigate to the Project

```bash
cd foodDelivery
```

### 2. Environment Variables

Create a `.env` file in the `node-backend` directory (if needed):

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://admin:password@mongodb:27017/fooddelivery?authSource=admin
```

Create a `.env.local` file in the `frontend` directory (if needed):

```env
NEXT_PUBLIC_API_URL=http://localhost/api
```

### 3. Build and Start Services

```bash
docker-compose up -d --build
```

This command will:
- Build Docker images for all services
- Start MongoDB database
- Start Node.js backend
- Start Next.js frontend
- Start Nginx reverse proxy

### 4. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **MongoDB**: localhost:27017

## Service Details

### MongoDB
- **Port**: 27017
- **Default Username**: admin
- **Default Password**: password
- **Database**: fooddelivery

### Node.js Backend
- **Port**: 5000
- **Internal URL**: http://node-backend:5000
- **External URL**: http://localhost:5000

### Next.js Frontend
- **Port**: 3000
- **Internal URL**: http://frontend:3000
- **External URL**: http://localhost:3000

### Nginx
- **Port**: 80
- **Routes**:
  - `/` → Frontend
  - `/api` → Backend API

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f node-backend
docker-compose logs -f mongodb
docker-compose logs -f nginx
```

### Stop Services
```bash
docker-compose down
```

### Stop and Remove Volumes
```bash
docker-compose down -v
```

### Rebuild Services
```bash
docker-compose up -d --build
```

### Restart a Specific Service
```bash
docker-compose restart frontend
docker-compose restart node-backend
```

## Production Deployment

### 1. Update Environment Variables

For production, update the environment variables in `docker-compose.yml`:

- Change MongoDB credentials
- Update API URLs
- Set proper NODE_ENV values

### 2. Use Environment Files

Create `.env` files and reference them in `docker-compose.yml`:

```yaml
services:
  node-backend:
    env_file:
      - ./node-backend/.env
```

### 3. SSL/HTTPS Setup

For production, add SSL certificates to Nginx:

1. Place SSL certificates in `nginx/ssl/`
2. Update `nginx/nginx.conf` to use HTTPS
3. Update docker-compose.yml to mount SSL certificates

### 4. Database Backup

Set up regular MongoDB backups:

```bash
docker exec food-delivery-mongodb mongodump --out /data/backup
```

## Troubleshooting

### Port Already in Use
If ports are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Change 80 to 8080
```

### Database Connection Issues
- Verify MongoDB is running: `docker-compose ps`
- Check MongoDB logs: `docker-compose logs mongodb`
- Verify connection string in backend environment variables

### Build Failures
- Clear Docker cache: `docker system prune -a`
- Rebuild without cache: `docker-compose build --no-cache`

## Cloud Deployment Options

### AWS
- Use AWS ECS or EC2 with Docker
- Use AWS RDS for MongoDB or DocumentDB
- Use AWS Application Load Balancer

### Google Cloud Platform
- Use Google Cloud Run
- Use Cloud SQL or MongoDB Atlas
- Use Cloud Load Balancing

### Azure
- Use Azure Container Instances
- Use Azure Cosmos DB or MongoDB Atlas
- Use Azure Application Gateway

### DigitalOcean
- Use App Platform or Droplets
- Use Managed MongoDB or MongoDB Atlas

## Monitoring

Consider adding monitoring tools:
- Prometheus + Grafana
- ELK Stack (Elasticsearch, Logstash, Kibana)
- New Relic or Datadog

## Security Considerations

1. **Change Default Passwords**: Update MongoDB credentials
2. **Use Secrets Management**: Use Docker secrets or environment variable management
3. **Enable HTTPS**: Configure SSL/TLS certificates
4. **Firewall Rules**: Restrict access to necessary ports only
5. **Regular Updates**: Keep Docker images and dependencies updated

## Support

For issues or questions, check the logs first:
```bash
docker-compose logs
```



