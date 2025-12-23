#!/bin/bash

# Food Delivery Application Deployment Script

echo "🚀 Starting Food Delivery Application Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service status
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost"
echo "   Backend API: http://localhost/api"
echo "   MongoDB: localhost:27017"
echo ""
echo "📝 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"



