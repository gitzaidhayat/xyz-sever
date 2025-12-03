// API Base URL
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// App Constants
export const APP_NAME = 'Abaya Wholesale';
export const APP_DESCRIPTION = 'Premium Quality Abayas at Wholesale Prices';

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  COD: 'cod',
  CARD: 'card',
  BANK: 'bank',
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

// Product Categories
export const PRODUCT_CATEGORIES = [
  'New Arrivals',
  'Premium Abayas',
  'Casual Abayas',
  'Arabic Classic',
  'Formal Wear',
  'Evening Collection',
];

// Sort Options
export const SORT_OPTIONS = [
  { label: 'Newest First', value: 'createdAt-desc' },
  { label: 'Oldest First', value: 'createdAt-asc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
  { label: 'Highest Rated', value: 'rating-desc' },
];

export default {
  API_BASE_URL,
  APP_NAME,
  APP_DESCRIPTION,
  DEFAULT_PAGE_SIZE,
  ADMIN_PAGE_SIZE,
  ORDER_STATUS,
  PAYMENT_METHODS,
  USER_ROLES,
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
};
