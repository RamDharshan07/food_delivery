# 🏗️ Architecture Guide - Which Server Does What?

## 📊 Service Overview

### 1. **Python Backend (Port 6000)** - Restaurant Service
**What it does:**
- Provides restaurant data
- Provides menu data for each restaurant
- Stores sample restaurant and menu information

**Endpoints:**
- `GET /restaurants` → Returns list of all restaurants
- `GET /restaurants/{id}/menu` → Returns menu for a specific restaurant

**When it runs:**
- When frontend requests restaurant list
- When user clicks on a restaurant to see menu

**How to see it working:**
Look at the Python terminal - you'll see:
```
[Python Service] GET /restaurants - Returning restaurant list
[Python Service] GET /restaurants/1/menu - Returning menu
```

---

### 2. **Node.js Backend (Ports 4000 & 4001)** - API Gateway + Order Service
**What it does:**
- Acts as API Gateway (routes requests)
- Handles order creation
- Handles order status
- Forwards restaurant requests to Python service

**Endpoints:**
- `GET /restaurants` → Forwards to Python (port 6000)
- `GET /restaurants/{id}/menu` → Forwards to Python (port 6000)
- `POST /order` → Creates new order (handled by Node.js)
- `GET /order/{id}` → Returns order status (handled by Node.js)

**When it runs:**
- **Port 4000**: Handles every OTHER request (load balanced)
- **Port 4001**: Handles every OTHER request (load balanced)
- NGINX distributes requests between these two ports

**How to see which instance handled the request:**
Look at the Node.js terminals - you'll see:
```
[Node.js Instance 4000] GET /restaurants
[Node.js Instance 4001] POST /order
[Node.js Instance 4000] GET /order/1000
```

---

### 3. **NGINX (Port 8000)** - Load Balancer & Reverse Proxy
**What it does:**
- Receives ALL requests from frontend
- Distributes requests between Node.js instances (4000 & 4001)
- Acts as a single entry point

**When it runs:**
- Always running (receives all frontend requests)
- Routes requests to Node.js instances in round-robin fashion

**How to see it working:**
- Check NGINX logs: `C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4\logs\access.log`
- Or watch Node.js terminals to see which instance gets each request

---

### 4. **Frontend (Port 3000)** - Next.js Web App
**What it does:**
- Displays the user interface
- Makes API calls to NGINX (port 8000)
- Shows restaurants, menus, and orders

**When it runs:**
- Always running when you access http://localhost:3000
- Makes requests to `http://localhost:8000` (NGINX)

---

## 🔄 Request Flow Examples

### Example 1: User Views Restaurant List

```
User Browser
    ↓
Frontend (port 3000)
    ↓ GET http://localhost:8000/restaurants
NGINX (port 8000)
    ↓ Routes to Node.js (round-robin)
Node.js Instance (port 4000 OR 4001)
    ↓ Forwards to Python
Python Backend (port 6000)
    ↓ Returns restaurant data
Node.js Instance
    ↓ Returns to NGINX
NGINX
    ↓ Returns to Frontend
Frontend displays restaurants
```

**Check terminals:**
- **Python terminal**: `[Python Service] GET /restaurants`
- **Node.js terminal (4000 or 4001)**: `[Node.js Instance XXXX] GET /restaurants`

---

### Example 2: User Places an Order

```
User clicks "Place Order"
    ↓
Frontend (port 3000)
    ↓ POST http://localhost:8000/order
NGINX (port 8000)
    ↓ Routes to Node.js (load balanced)
Node.js Instance (port 4000 OR 4001)
    ↓ Creates order in memory
    ↓ Returns order ID
NGINX
    ↓ Returns to Frontend
Frontend redirects to order status page
```

**Check terminals:**
- **Node.js terminal (4000 or 4001)**: `[Node.js Instance XXXX] POST /order` and `Order created: 1001`

---

### Example 3: User Checks Order Status

```
User views order page
    ↓
Frontend (port 3000)
    ↓ GET http://localhost:8000/order/1000 (every 3 seconds)
NGINX (port 8000)
    ↓ Routes to Node.js (load balanced)
Node.js Instance (port 4000 OR 4001)
    ↓ Returns order status from memory
NGINX
    ↓ Returns to Frontend
Frontend updates order status
```

**Check terminals:**
- **Node.js terminal (4000 or 4001)**: `[Node.js Instance XXXX] GET /order/1000` and `Order status requested: 1000 - out for delivery`

---

## 🔍 How to Verify Load Balancing

### Method 1: Watch Terminal Outputs

1. Open your **Node.js terminal windows** (ports 4000 and 4001)
2. Refresh the restaurant page multiple times in your browser
3. Watch which terminal shows the request:
   - First refresh → Port 4000
   - Second refresh → Port 4001
   - Third refresh → Port 4000
   - And so on...

### Method 2: Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Click on any request to `/restaurants` or `/order`
5. Check the **Response Headers** - you won't see which instance, but you can correlate with terminal logs

### Method 3: Check NGINX Logs

```powershell
Get-Content "C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4\logs\access.log" -Tail 20
```

---

## 📝 Quick Reference: What Each Service Stores

| Service | What It Stores |
|---------|---------------|
| **Python (6000)** | Restaurant list, Menu items |
| **Node.js (4000/4001)** | Orders (in memory), Order status |
| **NGINX (8000)** | Nothing (just routes requests) |
| **Frontend (3000)** | Cart items (in browser), UI state |

---

## 🎯 Testing Load Balancing

**Try this:**

1. Open both Node.js terminal windows (4000 and 4001)
2. In browser, refresh the restaurants page 10 times
3. Count requests in each terminal:
   - Port 4000 should handle ~5 requests
   - Port 4001 should handle ~5 requests
4. Place multiple orders - watch which instance creates each order

**Expected pattern:**
- Request 1 → Port 4000
- Request 2 → Port 4001
- Request 3 → Port 4000
- Request 4 → Port 4001
- (Round-robin continues...)

---

## 🛠️ Debugging Tips

**If you want to see detailed logs:**

1. **Python logs**: Already visible in terminal
2. **Node.js logs**: Already visible in terminal (shows which instance)
3. **NGINX logs**: 
   ```powershell
   Get-Content "C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4\logs\access.log" -Wait
   ```
4. **Frontend logs**: Open browser console (F12)

---

## 📊 Summary Table

| Port | Service | Handles | When It Runs |
|------|---------|---------|--------------|
| 3000 | Frontend | UI Display | Always (when browser open) |
| 8000 | NGINX | Load Balancing | Always (routes all requests) |
| 4000 | Node.js #1 | Orders, API Gateway | Every other request |
| 4001 | Node.js #2 | Orders, API Gateway | Every other request |
| 6000 | Python | Restaurants, Menus | When restaurant/menu requested |

---

**Remember:** All requests go through NGINX first, then NGINX distributes them between Node.js instances!



