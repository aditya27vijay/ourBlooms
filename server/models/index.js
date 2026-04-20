import { sequelize } from '../config/db.js';

// Import models
import User from './User.js';
import Category from './Category.js';
import Product from './Product.js';
import Address from './Address.js';
import DeliverySlot from './DeliverySlot.js';
import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Subscription from './Subscription.js';
import Coupon from './Coupon.js';
import Review from './Review.js';

// Define associations
// User associations
User.hasMany(Address, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(Cart, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Order, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Subscription, { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });

// Category associations
Category.hasMany(Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });

// Product associations
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.hasMany(CartItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(OrderItem, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(Subscription, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(Review, { foreignKey: 'product_id', onDelete: 'CASCADE' });

// Address associations
Address.belongsTo(User, { foreignKey: 'user_id' });
Address.hasMany(Order, { foreignKey: 'address_id', onDelete: 'SET NULL' });
Address.hasMany(Subscription, { foreignKey: 'address_id', onDelete: 'SET NULL' });

// DeliverySlot associations
DeliverySlot.hasMany(Order, { foreignKey: 'delivery_slot_id', onDelete: 'SET NULL' });

// Cart associations
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.hasMany(CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });

// CartItem associations
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id' });

// Order associations
Order.belongsTo(User, { foreignKey: 'user_id' });
Order.belongsTo(Address, { foreignKey: 'address_id' });
Order.belongsTo(DeliverySlot, { foreignKey: 'delivery_slot_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE' });

// OrderItem associations
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// Subscription associations
Subscription.belongsTo(User, { foreignKey: 'user_id' });
Subscription.belongsTo(Product, { foreignKey: 'product_id' });
Subscription.belongsTo(Address, { foreignKey: 'address_id' });

// Review associations
Review.belongsTo(User, { foreignKey: 'user_id' });
Review.belongsTo(Product, { foreignKey: 'product_id' });

// Export models
export {
  sequelize,
  User,
  Category,
  Product,
  Address,
  DeliverySlot,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Subscription,
  Coupon,
  Review
};