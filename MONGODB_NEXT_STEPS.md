# 🚀 Next Steps - MongoDB Integration

## ✅ What's Done

1. ✅ MongoDB dependencies installed (`mongoose`, `dotenv`)
2. ✅ `.env` file created with MongoDB connection string
3. ✅ Order model created (`models/Order.js`)
4. ✅ Database connection configured (`config/database.js`)
5. ✅ Server updated to use MongoDB instead of in-memory storage

## 📋 What You Need to Do Now

### Step 1: Make Sure MongoDB is Running

**Option A: Check if MongoDB Service is Running**
```powershell
Get-Service MongoDB*
```

**Option B: Check if MongoDB Port is Listening**
```powershell
netstat -ano | findstr :27017
```

**If MongoDB is NOT running:**

1. **Install MongoDB** (if not installed):
   - Download: https://www.mongodb.com/try/download/community
   - Install MongoDB Community Server
   - MongoDB will start as a Windows service automatically

2. **Or Start MongoDB Manually:**
   ```powershell
   # Navigate to MongoDB bin folder (usually C:\Program Files\MongoDB\Server\7.0\bin)
   mongod --dbpath "C:\data\db"
   ```

### Step 2: Restart Node.js Backend Servers

**Stop the current Node.js servers** (press `Ctrl+C` in each terminal)

**Then restart them:**

**Terminal 2 - Node.js (Port 4000):**
```powershell
cd "C:\Users\RAM DHARSHAN.E\Desktop\foodDelivery\node-backend"
$env:PORT=4000
npm start
```

**Terminal 3 - Node.js (Port 4001):**
```powershell
cd "C:\Users\RAM DHARSHAN.E\Desktop\foodDelivery\node-backend"
$env:PORT=4001
npm start
```

### Step 3: Verify MongoDB Connection

When you start Node.js, you should see:
```
✅ MongoDB Connected: localhost:27017
🚀 Node.js API Gateway running on port 4000
   Health check: http://localhost:4000/health
   MongoDB URI: mongodb://localhost:27017/foodDelivery
```

**If you see an error:**
- Make sure MongoDB is running
- Check the `.env` file has correct MongoDB URI
- Try connecting manually: `mongosh mongodb://localhost:27017`

### Step 4: Test the Application

1. **Place an order** through the frontend
2. **Check the terminal** - you should see: `Order created in MongoDB: 1000`
3. **Restart Node.js server** - order should still be there!

## 🧪 Quick Test

### Test 1: Health Check
```powershell
curl http://localhost:4000/health
```

Should return:
```json
{
  "status": "ok",
  "port": 4000,
  "service": "Node.js API Gateway",
  "database": "MongoDB Connected"
}
```

### Test 2: Place Order
1. Go to http://localhost:3000
2. Click on a restaurant
3. Add items to cart
4. Place order
5. Check terminal - should say "Order created in MongoDB"

### Test 3: Verify Persistence
1. Place an order (note the order ID)
2. Stop Node.js server (Ctrl+C)
3. Restart Node.js server
4. Check order status - should still exist!

## 📊 View Orders in MongoDB

### Option 1: MongoDB Compass (GUI - Recommended)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `foodDelivery` database
4. View `orders` collection

### Option 2: MongoDB Shell
```powershell
mongosh mongodb://localhost:27017
use foodDelivery
db.orders.find().pretty()
```

## 🎯 Summary

**Before (In-Memory):**
- Orders lost on server restart
- Each Node.js instance had separate orders

**After (MongoDB):**
- Orders persist after restart
- Both Node.js instances share the same database
- Can query and manage orders easily

## ❓ Troubleshooting

### Error: "MongoDB Connection Error"
**Solution:** Start MongoDB service or install MongoDB

### Error: "Cannot find module 'mongoose'"
**Solution:** Run `npm install` in node-backend folder

### Error: "EADDRINUSE: address already in use :27017"
**Solution:** MongoDB is already running (this is good!)

---

**Ready?** Restart your Node.js servers and test it out! 🎉



