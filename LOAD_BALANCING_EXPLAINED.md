# 🔀 When Does NGINX Choose Port 4000 vs 4001?

## Simple Answer: **Round-Robin (Alternating)**

NGINX uses **round-robin** load balancing, which means it **alternates** between the two Node.js instances.

---

## 📋 How It Works

### Request Pattern:
```
Request 1 → Port 4000
Request 2 → Port 4001
Request 3 → Port 4000
Request 4 → Port 4001
Request 5 → Port 4000
...and so on
```

**It's that simple!** NGINX keeps track and sends each new request to the next server in line.

---

## 🎯 When Each Port is Chosen

### Port 4000 is chosen when:
- **1st request** arrives
- **3rd request** arrives
- **5th request** arrives
- **7th request** arrives
- (Any odd-numbered request)

### Port 4001 is chosen when:
- **2nd request** arrives
- **4th request** arrives
- **6th request** arrives
- **8th request** arrives
- (Any even-numbered request)

---

## 🔍 Real Example

Let's say you refresh the restaurant page 5 times:

```
Browser Request 1 → NGINX → Port 4000 → Python → Response
Browser Request 2 → NGINX → Port 4001 → Python → Response
Browser Request 3 → NGINX → Port 4000 → Python → Response
Browser Request 4 → NGINX → Port 4001 → Python → Response
Browser Request 5 → NGINX → Port 4000 → Python → Response
```

**Terminals will show:**
- **Port 4000 terminal:** 3 requests (1st, 3rd, 5th)
- **Port 4001 terminal:** 2 requests (2nd, 4th)

---

## 📊 Visual Flow

```
NGINX (Port 8000)
    │
    ├─→ Request #1 ──→ Port 4000
    ├─→ Request #2 ──→ Port 4001
    ├─→ Request #3 ──→ Port 4000
    ├─→ Request #4 ──→ Port 4001
    ├─→ Request #5 ──→ Port 4000
    └─→ Request #6 ──→ Port 4001
```

---

## 🧪 Test It Yourself

### Test 1: Restaurant List
1. Open both Node.js terminals (4000 and 4001)
2. Refresh browser page 6 times
3. Count requests in each terminal:
   - **Port 4000:** Should have 3 requests (1st, 3rd, 5th)
   - **Port 4001:** Should have 3 requests (2nd, 4th, 6th)

### Test 2: Multiple Orders
1. Place 4 orders quickly
2. Watch which terminal creates each order:
   - Order 1 → Port 4000
   - Order 2 → Port 4001
   - Order 3 → Port 4000
   - Order 4 → Port 4001

### Test 3: Order Status Polling
1. Place 1 order
2. Go to order status page (auto-refreshes every 3 seconds)
3. Watch terminals - status checks alternate:
   - Check 1 → Port 4000
   - Check 2 → Port 4001
   - Check 3 → Port 4000
   - Check 4 → Port 4001

---

## ⚙️ How NGINX Decides (Technical)

In `nginx.conf`, we have:

```nginx
upstream node_backend {
    server localhost:4000;
    server localhost:4001;
}
```

**Default behavior:** Round-robin (no special configuration needed)

**What happens:**
1. NGINX receives request
2. Checks which server handled the last request
3. Sends to the OTHER server
4. Updates its internal counter

---

## 🎲 Is It Random?

**NO!** It's **deterministic** (predictable):
- Always alternates
- Always starts with port 4000
- Always follows the same pattern

**Why?**
- Ensures even distribution
- Predictable for testing
- Easy to debug

---

## 🔧 What If One Server is Down?

If port 4000 is down:
- NGINX will skip it
- All requests go to port 4001
- You'll see errors in NGINX logs

If port 4001 is down:
- NGINX will skip it
- All requests go to port 4000
- You'll see errors in NGINX logs

---

## 📝 Summary

| Request Number | Goes To Port |
|----------------|--------------|
| 1st            | 4000         |
| 2nd            | 4001         |
| 3rd            | 4000         |
| 4th            | 4001         |
| 5th            | 4000         |
| 6th            | 4001         |
| ...            | ...          |

**Pattern:** Odd requests → 4000, Even requests → 4001

---

## 💡 Key Points

1. **It's automatic** - NGINX handles it
2. **It's alternating** - Always switches between servers
3. **It's even** - Distributes load equally
4. **It's predictable** - Same pattern every time

---

## 🎯 Quick Test Right Now

1. **Open your browser**
2. **Open both Node.js terminals** (side by side)
3. **Refresh the page 10 times** (F5)
4. **Count the logs** in each terminal
5. **Result:** Each should have ~5 requests (alternating)

**That's how you know load balancing is working!** 🎉



