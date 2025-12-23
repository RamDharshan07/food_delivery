from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List

app = FastAPI(title="Restaurant Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample restaurant data
RESTAURANTS = [
    {
        "id": 1,
        "name": "Pizza Palace",
        "cuisine": "Italian",
        "rating": 4.5,
        "deliveryTime": "30-40 mins"
    },
    {
        "id": 2,
        "name": "Burger King",
        "cuisine": "American",
        "rating": 4.2,
        "deliveryTime": "25-35 mins"
    },
    {
        "id": 3,
        "name": "Sushi Express",
        "cuisine": "Japanese",
        "rating": 4.7,
        "deliveryTime": "35-45 mins"
    },
    {
        "id": 4,
        "name": "Curry House",
        "cuisine": "Indian",
        "rating": 4.6,
        "deliveryTime": "30-40 mins"
    },
    {
        "id": 5,
        "name": "Taco Fiesta",
        "cuisine": "Mexican",
        "rating": 4.3,
        "deliveryTime": "20-30 mins"
    }
]

# Sample menu data
MENUS = {
    1: [  # Pizza Palace
        {"id": 101, "name": "Margherita Pizza", "description": "Classic tomato and mozzarella", "price": 299},
        {"id": 102, "name": "Pepperoni Pizza", "description": "Spicy pepperoni with cheese", "price": 349},
        {"id": 103, "name": "Veggie Supreme", "description": "Loaded with vegetables", "price": 379},
        {"id": 104, "name": "Garlic Bread", "description": "Crispy garlic bread sticks", "price": 149},
        {"id": 105, "name": "Coca Cola", "description": "500ml cold drink", "price": 50}
    ],
    2: [  # Burger King
        {"id": 201, "name": "Classic Burger", "description": "Beef patty with veggies", "price": 199},
        {"id": 202, "name": "Chicken Burger", "description": "Crispy chicken patty", "price": 229},
        {"id": 203, "name": "Cheese Burger", "description": "Double cheese burger", "price": 249},
        {"id": 204, "name": "French Fries", "description": "Crispy golden fries", "price": 99},
        {"id": 205, "name": "Onion Rings", "description": "Crispy onion rings", "price": 129}
    ],
    3: [  # Sushi Express
        {"id": 301, "name": "Salmon Sushi", "description": "Fresh salmon sushi (6 pieces)", "price": 499},
        {"id": 302, "name": "Tuna Sushi", "description": "Fresh tuna sushi (6 pieces)", "price": 449},
        {"id": 303, "name": "California Roll", "description": "Crab and avocado roll (8 pieces)", "price": 399},
        {"id": 304, "name": "Miso Soup", "description": "Traditional miso soup", "price": 149},
        {"id": 305, "name": "Edamame", "description": "Steamed soybeans", "price": 199}
    ],
    4: [  # Curry House
        {"id": 401, "name": "Butter Chicken", "description": "Creamy tomato curry", "price": 349},
        {"id": 402, "name": "Chicken Biryani", "description": "Fragrant rice with chicken", "price": 299},
        {"id": 403, "name": "Paneer Tikka", "description": "Grilled cottage cheese", "price": 249},
        {"id": 404, "name": "Garlic Naan", "description": "Buttery garlic bread", "price": 79},
        {"id": 405, "name": "Mango Lassi", "description": "Sweet mango yogurt drink", "price": 99}
    ],
    5: [  # Taco Fiesta
        {"id": 501, "name": "Beef Tacos", "description": "Spiced beef tacos (3 pieces)", "price": 249},
        {"id": 502, "name": "Chicken Tacos", "description": "Grilled chicken tacos (3 pieces)", "price": 229},
        {"id": 503, "name": "Veggie Tacos", "description": "Fresh vegetable tacos (3 pieces)", "price": 199},
        {"id": 504, "name": "Nachos", "description": "Loaded nachos with cheese", "price": 179},
        {"id": 505, "name": "Guacamole", "description": "Fresh avocado dip", "price": 149}
    ]
}

@app.get("/")
def read_root():
    return {"service": "Restaurant Service", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Python Restaurant Service"}

@app.get("/restaurants", response_model=List[dict])
def get_restaurants():
    print("[Python Service] GET /restaurants - Returning restaurant list")
    return RESTAURANTS

@app.get("/restaurants/{restaurant_id}/menu")
def get_menu(restaurant_id: int):
    print(f"[Python Service] GET /restaurants/{restaurant_id}/menu - Returning menu")
    menu = MENUS.get(restaurant_id, [])
    if not menu:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return menu

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Python Restaurant Service on port 6000")
    uvicorn.run(app, host="0.0.0.0", port=6000)

