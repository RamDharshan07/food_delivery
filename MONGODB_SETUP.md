# 🍃 MongoDB Setup Guide

## Prerequisites

1. **Install MongoDB** on your local machine
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud) - free tier available

2. **Start MongoDB Service**
   - Windows: MongoDB should start automatically as a service
   - Or run manually: `mongod` (if installed locally)

## Configuration

### 1. Environment File

The `.env` file is already created in `node-backend/` folder:

```env
MONGODB_URI=mongodb://localhost:27017/foodDelivery
PORT=4000
```

**Default MongoDB URI:** `mongodb://localhost:27017/foodDelivery`
- `localhost:27017` - MongoDB default port
- `foodDelivery` - Database name

### 2. Install Dependencies

```powershell
cd node-backend
npm install
```

This will install:
- `mongoose` - MongoDB ODM (Object Document Mapper)
- `dotenv` - Environment variable loader

## How It Works

### Before (In-Memory):
- Orders stored in JavaScript object
- Lost when server restarts
- Not shared between Node.js instances

### After (MongoDB):
- Orders stored in MongoDB database
- Persists after server restart
- Shared between both Node.js instances (4000 & 4001)

## Database Structure

**Collection:** `orders`

**Schema:**
```javascript
{
  orderId: Number,        // Unique order ID (1000, 1001, ...)
  restaurantId: Number,   // Restaurant ID
  items: [                // Array of order items
    {
      menuItemId: Number,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  status: String,         // pending, confirmed, preparing, out for delivery, delivered
  createdAt: Date,       // Order creation time
  updatedAt: Date        // Last update time
}
```

## Testing MongoDB Connection

### Method 1: Check Server Logs

When you start Node.js backend, you should see:
```
✅ MongoDB Connected: localhost:27017
🚀 Node.js API Gateway running on port 4000
   Health check: http://localhost:4000/health
   MongoDB URI: mongodb://localhost:27017/foodDelivery
```

### Method 2: Health Check Endpoint

```powershell
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "port": 4000,
  "service": "Node.js API Gateway",
  "database": "MongoDB Connected"
}
```

### Method 3: Use MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `foodDelivery` database
4. View `orders` collection

## Troubleshooting

### Error: "MongoDB Connection Error"

**Solution 1:** Make sure MongoDB is running
```powershell
# Check if MongoDB is running
Get-Service MongoDB
```

**Solution 2:** Start MongoDB manually
```powershell
# If MongoDB is installed but not running
mongod --dbpath "C:\data\db"
```

**Solution 3:** Check MongoDB port
- Default port: 27017
- Make sure nothing else is using this port

### Error: "Cannot find module 'mongoose'"

**Solution:** Install dependencies
```powershell
cd node-backend
npm install
```

### Error: "EADDRINUSE: address already in use"

**Solution:** MongoDB is already running (this is good!)

## Verify Orders Are Saved

1. **Place an order** through the frontend
2. **Check MongoDB Compass** or use MongoDB shell:
   ```javascript
   use foodDelivery
   db.orders.find().pretty()
   ```
3. **Restart Node.js server** - orders should still be there!

## Benefits of MongoDB

✅ **Persistence** - Orders survive server restarts
✅ **Shared Storage** - Both Node.js instances (4000 & 4001) see the same orders
✅ **Scalability** - Easy to add more features later
✅ **Query Power** - Can search, filter, and aggregate orders

## Next Steps

After MongoDB is set up:
1. Restart Node.js backend instances
2. Place a test order
3. Check MongoDB to see the order saved
4. Restart server - order should still be there!

---

**Note:** If you don't have MongoDB installed, you can:
1. Install MongoDB locally (recommended for development)
2. Use MongoDB Atlas (free cloud database)
3. Or continue using in-memory storage (remove MongoDB code)



