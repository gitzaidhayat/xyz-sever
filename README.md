# Abaya Wholesale E-Commerce Frontend

A production-ready MERN E-Commerce frontend built with React, Vite, Tailwind CSS v4, Redux Toolkit, and modern web technologies. Features an elegant Abaya wholesale theme with beige/gold aesthetics.

## 🎨 Design Features

- **Tailwind CSS v4** - No config files, pure utility classes
- **Abaya Wholesale Theme** - Warm beige (#f5e9da) backgrounds with gold (#d5a437) accents
- **Elegant Typography** - Playfair Display for headings, Inter for body text
- **Fully Responsive** - Mobile-first design approach
- **Dark Admin Panel** - Professional admin interface with sidebar navigation

## 🚀 Tech Stack

- **React 18** with Vite for blazing fast development
- **Tailwind CSS v4** (inline utilities only, no config)
- **React Router v6** for client-side routing
- **Redux Toolkit** for state management
- **Axios** with interceptors for API calls
- **JWT Authentication** (access + refresh tokens)
- **React Icons** for beautiful iconography

## 📁 Project Structure

```
src/
├── api/                  # API client and endpoints
│   ├── apiClient.js     # Axios instance with interceptors
│   ├── authApi.js       # Authentication endpoints
│   ├── productApi.js    # Product endpoints
│   ├── cartApi.js       # Cart endpoints
│   ├── orderApi.js      # Order endpoints
│   └── adminApi.js      # Admin endpoints
├── assets/              # Static assets
├── components/          # React components
│   ├── layout/          # Layout components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── common/          # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Loader.jsx
│   │   ├── Modal.jsx
│   │   └── EmptyState.jsx
│   ├── product/         # Product components
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   └── ProductFilter.jsx
│   ├── cart/            # Cart components
│   │   └── CartItem.jsx
│   └── admin/           # Admin components
│       ├── AdminSidebar.jsx
│       └── StatsCard.jsx
├── pages/               # Page components
│   ├── HomePage.jsx
│   ├── ProductListPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── OrdersPage.jsx
│   ├── ProfilePage.jsx
│   ├── Auth/
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── AdminProductsPage.jsx
│       ├── AdminOrdersPage.jsx
│       ├── AdminUsersPage.jsx
│       └── AdminCouponsPage.jsx
├── routes/              # Route configuration
│   └── AppRoutes.jsx
├── store/               # Redux store
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── productSlice.js
│       ├── cartSlice.js
│       └── orderSlice.js
├── hooks/               # Custom hooks
│   ├── useAuth.js
│   └── useCart.js
├── styles/              # Global styles
│   └── globals.css      # Tailwind v4 import
├── config/              # Configuration
│   └── constants.js
├── App.jsx              # Main App component
└── main.jsx             # Entry point
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   
   The `.env` file is already created with:
   ```
   VITE_BACKEND_URL="http://localhost:5000/api"
   ```
   
   Update this URL to match your backend server.

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎯 Features

### User Features
- ✅ User registration and login
- ✅ JWT authentication with refresh token
- ✅ Browse products with filters and pagination
- ✅ Product search functionality
- ✅ Product details with variants
- ✅ Shopping cart management
- ✅ Coupon code application
- ✅ Checkout with shipping address
- ✅ Order history and tracking
- ✅ Profile management
- ✅ Password change

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Product management (CRUD)
- ✅ Order management with status updates
- ✅ User management (activate/deactivate)
- ✅ Coupon management
- ✅ Dark sidebar navigation

## 🎨 Theme Colors

```css
Background: #f5e9da (warm beige)
Primary: #d5a437 (gold)
Secondary: #e0b54d (light gold)
Text: #1f2933 (dark charcoal)
Dark: #111111 (footer/admin sidebar)
```

## 🔐 Protected Routes

- `/checkout` - Requires authentication
- `/orders` - Requires authentication
- `/profile` - Requires authentication
- `/admin/*` - Requires admin role

## 📡 API Integration

All API calls use the environment variable `VITE_BACKEND_URL`. The axios client includes:

- Automatic JWT token attachment
- Token refresh on 401 errors
- Global error handling
- Request/response interceptors

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://localhost:5000/api` |

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🚦 Getting Started

1. Ensure your backend server is running
2. Update `.env` with correct backend URL
3. Run `npm install`
4. Run `npm run dev`
5. Open `http://localhost:3000`

## 📝 Important Notes

- **Tailwind CSS v4** - No `tailwind.config.js` or `postcss.config.js` needed
- **Only `globals.css`** contains: `@import "tailwindcss";`
- All styling uses inline utility classes
- Google Fonts (Playfair Display & Inter) are loaded via CDN in `index.html`

## 🎭 Default User Roles

- `user` - Regular customer
- `admin` - Administrator with full access

## 🔄 State Management

Redux Toolkit manages:
- Authentication state
- Product listings and filters
- Shopping cart
- Orders
- Admin data

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "@reduxjs/toolkit": "^2.0.1",
  "react-redux": "^9.0.4",
  "axios": "^1.6.2",
  "react-icons": "^5.0.1",
  "tailwindcss": "^4.0.0"
}
```

## 🤝 Contributing

This is a complete production-ready template. Feel free to customize according to your needs.

## 📄 License

MIT License - Feel free to use this project for commercial purposes.

---

**Built with ❤️ for Abaya Wholesale E-Commerce**
