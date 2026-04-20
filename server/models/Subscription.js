import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { SUBSCRIPTION_FREQUENCIES, SUBSCRIPTION_STATUSES } from '../utils/constants.js';

const Subscription = sequelize.define('Subscription', {
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
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  frequency: {
    type: DataTypes.ENUM,
    values: Object.values(SUBSCRIPTION_FREQUENCIES),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
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
  status: {
    type: DataTypes.ENUM,
    values: Object.values(SUBSCRIPTION_STATUSES),
    defaultValue: SUBSCRIPTION_STATUSES.ACTIVE
  },
  next_delivery: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  cancel_at: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'When to cancel the subscription'
  },
  paused_until: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'When the pause ends'
  }
}, {
  tableName: 'subscriptions',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['next_delivery']
    }
  ]
});

// Instance methods
Subscription.prototype.isActive = function() {
  return this.status === SUBSCRIPTION_STATUSES.ACTIVE;
};

Subscription.prototype.isPaused = function() {
  return this.status === SUBSCRIPTION_STATUSES.PAUSED;
};

Subscription.prototype.canDeliver = function() {
  const today = new Date().toISOString().split('T')[0];
  return this.isActive() && this.next_delivery <= today;
};

Subscription.prototype.pause = function(weeks = 1) {
  const pauseUntil = new Date();
  pauseUntil.setDate(pauseUntil.getDate() + (weeks * 7));
  this.paused_until = pauseUntil.toISOString().split('T')[0];
  this.status = SUBSCRIPTION_STATUSES.PAUSED;
};

Subscription.prototype.resume = function() {
  this.status = SUBSCRIPTION_STATUSES.ACTIVE;
  this.paused_until = null;
};

Subscription.prototype.cancel = function() {
  const cancelDate = new Date();
  cancelDate.setMonth(cancelDate.getMonth() + 1); // Cancel at end of billing period
  this.cancel_at = cancelDate.toISOString().split('T')[0];
};

Subscription.prototype.calculateNextDelivery = function() {
  const nextDate = new Date(this.next_delivery);

  switch (this.frequency) {
    case SUBSCRIPTION_FREQUENCIES.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case SUBSCRIPTION_FREQUENCIES.FORTNIGHTLY:
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case SUBSCRIPTION_FREQUENCIES.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }

  return nextDate.toISOString().split('T')[0];
};

export default Subscription;