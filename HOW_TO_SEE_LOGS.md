# 🔍 How to See Which Server Handled Which Request

## Quick Guide to Monitor Your Services

### 1. **Watch Python Backend (Restaurant Service)**

**Terminal:** Python Backend terminal

**What you'll see:**
```
[Python Service] GET /restaurants - Returning restaurant list
[Python Service] GET /restaurants/1/menu - Returning menu
```

**When it appears:**
- When you load the restaurant list page
- When you click on a restaurant to see menu

---

### 2. **Watch Node.js Backend (Order Service) - Port 4000**

**Terminal:** Node.js Instance 1 (Port 4000)

**What you'll see:**
```
[Node.js Instance 4000] GET /restaurants
[Node.js Instance 4000] Forwarding /restaurants to Python service
[Node.js Instance 4000] POST /order
[Node.js Instance 4000] Order created: 1001
[Node.js Instance 4000] GET /order/1001
[Node.js Instance 4000] Order status requested: 1001 - pending
```

**When it appears:**
- Every OTHER request (load balanced with port 4001)
- When you place an order (might be port 4000 or 4001)
- When you check order status

---

### 3. **Watch Node.js Backend (Order Service) - Port 4001**

**Terminal:** Node.js Instance 2 (Port 4001)

**What you'll see:**
```
[Node.js Instance 4001] GET /restaurants
[Node.js Instance 4001] Forwarding /restaurants to Python service
[Node.js Instance 4001] POST /order
[Node.js Instance 4001] Order created: 1002
[Node.js Instance 4001] GET /order/1002
[Node.js Instance 4001] Order status requested: 1002 - confirmed
```

**When it appears:**
- Every OTHER request (load balanced with port 4000)
- Alternates with port 4000

---

### 4. **Watch NGINX Logs**

**Location:** `C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4\logs\access.log`

**How to view:**
```powershell
Get-Content "C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4\logs\access.log" -Tail 20
```

**Or watch in real-time:**
```powershell
Get-Content "C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4\logs\access.log" -Wait
```

**What you'll see:**
```
127.0.0.1 - - [22/Dec/2025:11:30:15 +0530] "GET /restaurants HTTP/1.1" 200 1234
127.0.0.1 - - [22/Dec/2025:11:30:18 +0530] "POST /order HTTP/1.1" 201 45
```

---

## 🧪 Test Load Balancing - Step by Step

### Test 1: Restaurant List Requests

1. **Open both Node.js terminals** (4000 and 4001) side by side
2. **Refresh the browser page** 5 times
3. **Watch the terminals:**
   - Refresh 1 → Port 4000 shows request
   - Refresh 2 → Port 4001 shows request
   - Refresh 3 → Port 4000 shows request
   - Refresh 4 → Port 4001 shows request
   - Refresh 5 → Port 4000 shows request

**Expected:** Requests alternate between ports 4000 and 4001

---

### Test 2: Order Creation

1. **Open both Node.js terminals**
2. **Place 3 orders** from the browser
3. **Watch which terminal shows "Order created":**
   - Order 1 → Might be port 4000 or 4001
   - Order 2 → The OTHER port
   - Order 3 → Back to first port

**Expected:** Orders are distributed between both ports

---

### Test 3: Order Status Polling

1. **Place an order** and go to order status page
2. **Watch Node.js terminals** - you'll see:
   ```
   [Node.js Instance 4000] GET /order/1000
   [Node.js Instance 4000] Order status requested: 1000 - pending
   ```
3. **Wait 3 seconds** (auto-refresh)
4. **Watch again** - might be port 4001 this time:
   ```
   [Node.js Instance 4001] GET /order/1000
   [Node.js Instance 4001] Order status requested: 1000 - confirmed
   ```

**Expected:** Status checks alternate between ports

---

## 📊 Understanding the Logs

### Python Service Logs
```
[Python Service] GET /restaurants - Returning restaurant list
```
- **Meaning:** Python received request for restaurant list
- **Action:** Python returned 5 restaurants

```
[Python Service] GET /restaurants/1/menu - Returning menu
```
- **Meaning:** Python received request for menu of restaurant #1
- **Action:** Python returned menu items

---

### Node.js Service Logs
```
[Node.js Instance 4000] GET /restaurants
[Node.js Instance 4000] Forwarding /restaurants to Python service
```
- **Meaning:** Node.js received request, forwarding to Python
- **Action:** Node.js acts as gateway

```
[Node.js Instance 4001] POST /order
[Node.js Instance 4001] Order created: 1003
```
- **Meaning:** Node.js created a new order
- **Action:** Order stored in Node.js memory, ID returned

```
[Node.js Instance 4000] GET /order/1003
[Node.js Instance 4000] Order status requested: 1003 - preparing
```
- **Meaning:** Node.js returned order status
- **Action:** Status might have progressed (pending → confirmed → preparing → out for delivery → delivered)

---

## 🎯 Quick Commands to Check Status

### Check which ports are listening:
```powershell
netstat -ano | findstr ":3000 :4000 :4001 :6000 :8000"
```

### Check if NGINX is running:
```powershell
Get-Process -Name nginx
```

### Check Node.js processes:
```powershell
Get-Process -Name node
```

### View recent NGINX access logs:
```powershell
Get-Content "C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4\logs\access.log" -Tail 10
```

---

## 💡 Pro Tips

1. **Keep all 5 terminals visible** to see the full flow
2. **Watch the order of logs** to understand request flow
3. **Count requests** in each Node.js terminal to verify load balancing
4. **Check order IDs** - each order is created by one Node.js instance, but status checks can go to either

---

## 🔄 Complete Request Flow Visualization

```
Browser Request
    ↓
Frontend (port 3000) - Makes API call
    ↓
NGINX (port 8000) - Receives request
    ↓
    ├─→ Node.js 4000 (if round-robin says so)
    │       ↓
    │       ├─→ Python 6000 (if restaurant/menu request)
    │       │       ↓ Returns data
    │       ↓ Returns to NGINX
    │
    └─→ Node.js 4001 (if round-robin says so)
            ↓
            ├─→ Python 6000 (if restaurant/menu request)
            │       ↓ Returns data
            ↓ Returns to NGINX
    ↓
NGINX returns to Frontend
    ↓
Frontend displays data
```

**Watch the terminals to see this flow in action!**



