import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { ORDER_STATUSES, PAYMENT_PROVIDERS } from '../utils/constants.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: Object.values(ORDER_STATUSES),
    defaultValue: ORDER_STATUSES.PENDING
  },
  total_paise: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  delivery_slot_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'delivery_slots',
      key: 'id'
    }
  },
  address_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'addresses',
      key: 'id'
    }
  },
  payment_provider: {
    type: DataTypes.ENUM,
    values: Object.values(PAYMENT_PROVIDERS),
    defaultValue: PAYMENT_PROVIDERS.RAZORPAY
  },
  payment_ref: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Payment gateway reference ID'
  },
  gift_message: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['delivery_slot_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Instance methods
Order.prototype.getTotalRupees = function() {
  return this.total_paise / 100;
};

Order.prototype.canCancel = function() {
  return [ORDER_STATUSES.PENDING].includes(this.status);
};

Order.prototype.canUpdateStatus = function(newStatus) {
  const validTransitions = {
    [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.PAID, ORDER_STATUSES.CANCELLED],
    [ORDER_STATUSES.PAID]: [ORDER_STATUSES.PREPARING, ORDER_STATUSES.CANCELLED],
    [ORDER_STATUSES.PREPARING]: [ORDER_STATUSES.OUT_FOR_DELIVERY],
    [ORDER_STATUSES.OUT_FOR_DELIVERY]: [ORDER_STATUSES.DELIVERED]
  };

  return validTransitions[this.status]?.includes(newStatus) || false;
};

export default Order;