#!/bin/bash

echo "🚀 Starting Food Delivery Application (Native Mode)"
echo ""

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed or not in PATH"
    echo "Please install MongoDB or add it to your PATH"
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p ./data/db

# Start MongoDB in background
echo "🗄️  Starting MongoDB..."
mongod --dbpath ./data/db --fork --logpath ./data/mongodb.log

# Wait for MongoDB to start
echo "⏳ Waiting for MongoDB to start..."
sleep 3

# Install backend dependencies if needed
echo "📦 Installing backend dependencies..."
cd node-backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Install frontend dependencies if needed
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

# Start backend in background
echo "🔧 Starting Node.js Backend..."
cd node-backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 3

# Start frontend
echo "🎨 Starting Next.js Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ All services are starting!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api"
echo "   Health Check: http://localhost:5000/api/health"
echo ""
echo "📝 Process IDs:"
echo "   MongoDB: (running in background)"
echo "   Backend: $BACKEND_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "🛑 To stop services, press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user interrupt
wait



