import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cart_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'carts',
      key: 'id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  price_paise: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Price at time of adding to cart'
  }
}, {
  tableName: 'cart_items',
  indexes: [
    {
      fields: ['cart_id']
    },
    {
      fields: ['product_id']
    },
    {
      unique: true,
      fields: ['cart_id', 'product_id']
    }
  ]
});

// Instance methods
CartItem.prototype.getTotalPrice = function() {
  return this.quantity * this.price_paise;
};

CartItem.prototype.getTotalPriceRupees = function() {
  return this.getTotalPrice() / 100;
};

export default CartItem;