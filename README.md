# Food Delivery Application

A simple food delivery system similar to Zomato/Swiggy, built with Next.js, Node.js, Python FastAPI, and NGINX.

## Architecture

```
Frontend (Next.js) → NGINX (Port 80) → Node.js API Gateway (Ports 4000, 4001) → Python FastAPI (Port 6000)
                                              ↓
                                        Order Service (Node.js)
```

### Components

1. **Frontend (Next.js)**: Food delivery website UI
   - View restaurant list
   - Search restaurants
   - View menu
   - Place orders
   - Check order status

2. **NGINX**: Reverse proxy and load balancer
   - Routes all requests from frontend
   - Load balances between two Node.js instances

3. **Node.js Backend (API Gateway + Order Service)**:
   - Port 4000: First instance
   - Port 4001: Second instance
   - Handles order creation and status
   - Forwards restaurant requests to Python service

4. **Python Backend (Restaurant Service)**:
   - Port 6000
   - Returns restaurant list
   - Returns menu for restaurants

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- NGINX for Windows ([Download here](http://nginx.org/en/download.html))

## Installation & Setup

### 1. Install Frontend Dependencies

```powershell
cd frontend
npm install
```

### 2. Install Node.js Backend Dependencies

```powershell
cd node-backend
npm install
```

### 3. Install Python Backend Dependencies

```powershell
cd python-backend
pip install -r requirements.txt
```

### 4. Setup NGINX

1. Download NGINX for Windows from http://nginx.org/en/download.html
2. Extract to a folder (e.g., `C:\nginx`)
3. Copy `nginx/nginx.conf` to `C:\nginx\conf\nginx.conf` (replace existing)
4. Create logs directory: `C:\nginx\logs\` (if it doesn't exist)

## Running the Application

**Open 4 separate PowerShell/Command Prompt windows:**

### Terminal 1: Python Backend (Port 6000)

```powershell
cd python-backend
python main.py
```

You should see:
```
🚀 Starting Python Restaurant Service on port 6000
```

### Terminal 2: Node.js Backend Instance 1 (Port 4000)

```powershell
cd node-backend
$env:PORT=4000
npm start
```

Or on Command Prompt:
```cmd
cd node-backend
set PORT=4000
npm start
```

You should see:
```
🚀 Node.js API Gateway running on port 4000
```

### Terminal 3: Node.js Backend Instance 2 (Port 4001)

```powershell
cd node-backend
$env:PORT=4001
npm start
```

Or on Command Prompt:
```cmd
cd node-backend
set PORT=4001
npm start
```

You should see:
```
🚀 Node.js API Gateway running on port 4001
```

### Terminal 4: NGINX

```powershell
cd C:\nginx
.\nginx.exe
```

To stop NGINX:
```powershell
.\nginx.exe -s stop
```

### Terminal 5: Frontend (Next.js)

```powershell
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## How It Works

1. **User opens Next.js app** → Frontend loads at `http://localhost:3000`

2. **Frontend fetches restaurants** → Makes request to `http://localhost/restaurants`
   - NGINX receives request on port 80
   - NGINX forwards to Node.js backend (load balanced between 4000 and 4001)
   - Node.js forwards to Python service on port 6000
   - Python returns restaurant data
   - Response flows back through the chain

3. **User places order** → Frontend sends `POST http://localhost/order`
   - NGINX load balances request to Node.js (4000 or 4001)
   - Node.js creates order and returns order ID
   - You can see in console logs which instance handled the request

4. **Check order status** → Frontend sends `GET http://localhost/order/{id}`
   - NGINX load balances to Node.js
   - Node.js returns order status

## Console Logs

Watch the console logs to see:
- Which Node.js instance (4000 or 4001) handles each request (proves load balancing)
- Python service logs when it returns restaurant/menu data
- Order creation and status updates

## Testing Load Balancing

1. Open browser developer tools (F12)
2. Go to Network tab
3. Refresh the restaurants page multiple times
4. Check the Node.js terminal windows - you should see requests distributed between port 4000 and 4001

## API Endpoints

### Frontend → NGINX (http://localhost)

- `GET /restaurants` - Get list of restaurants
- `GET /restaurants/:id/menu` - Get menu for a restaurant
- `POST /order` - Create an order
  ```json
  {
    "restaurantId": 1,
    "items": [
      {
        "menuItemId": 101,
        "name": "Margherita Pizza",
        "quantity": 2,
        "price": 299
      }
    ]
  }
  ```
- `GET /order/:id` - Get order status

## Troubleshooting

1. **Port already in use**: Make sure ports 3000, 4000, 4001, 6000, and 80 are not in use
2. **NGINX not starting**: Check if port 80 is available (may need admin rights)
3. **Connection refused**: Ensure all services are running before starting the frontend
4. **CORS errors**: All services have CORS enabled, but check if all are running

## Project Structure

```
foodDelivery/
├── frontend/              # Next.js frontend
│   ├── app/
│   │   ├── page.jsx      # Home page (restaurant list)
│   │   ├── restaurant/[id]/page.jsx  # Restaurant menu page
│   │   └── order/[id]/page.jsx       # Order status page
│   └── package.json
├── node-backend/         # Node.js API Gateway + Order Service
│   ├── server.js
│   └── package.json
├── python-backend/       # Python Restaurant Service
│   ├── main.py
│   └── requirements.txt
├── nginx/                # NGINX configuration
│   └── nginx.conf
└── README.md
```

## Notes

- This is a simplified demo application
- Orders are stored in-memory (will be lost on server restart)
- No authentication or payment processing
- Designed for learning and demonstration purposes



