# Study-Material-Marketplace
File Structure
Study-Material-Marketplace/
├── backend/                          # Express.js backend
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── controllers/                  # Business logic
│   │   ├── authController.js
│   │   ├── listingController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/                       # API routes
│   │   ├── auth.js
│   │   ├── listings.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js                  # Auth middleware
│   ├── package.json
│   ├── .env
│   └── server.js                    # Entry point
│
├── frontend/                         # React app
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js               # Axios configuration
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Listings.jsx
│   │   │   ├── ListingDetail.jsx
│   │   │   ├── AddListing.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── Profile.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ListingCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── CartItem.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state
│   │   │   └── CartContext.jsx      # Cart state
│   │   ├── App.jsx                  # Route definitions
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── tailwind.config.js
│
├── database/
│   └── schema.sql                   # Database tables and sample data
│
├── README.md                        # This file
├── deployment-guide.md              # Deployment instructions
└── backend-setup-guide.md           # Complete backend code
