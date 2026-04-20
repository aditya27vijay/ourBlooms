import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const DeliverySlot = sequelize.define('DeliverySlot', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time_window: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g., "9:00 AM - 11:00 AM"'
  },
  max_orders: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  booked: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'delivery_slots',
  indexes: [
    {
      unique: true,
      fields: ['date', 'time_window']
    },
    {
      fields: ['date']
    }
  ]
});

// Instance methods
DeliverySlot.prototype.isAvailable = function() {
  return this.booked < this.max_orders;
};

DeliverySlot.prototype.getRemainingCapacity = function() {
  return Math.max(0, this.max_orders - this.booked);
};

DeliverySlot.prototype.canBook = function() {
  return this.isAvailable();
};

export default DeliverySlot;