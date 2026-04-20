import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { COUPON_TYPES } from '../utils/constants.js';

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 20]
    }
  },
  discount_type: {
    type: DataTypes.ENUM,
    values: Object.values(COUPON_TYPES),
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  used_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'coupons',
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['expires_at']
    },
    {
      fields: ['is_active']
    }
  ]
});

// Instance methods
Coupon.prototype.isValid = function() {
  const now = new Date();
  return this.is_active && this.expires_at > now && (this.usage_limit === null || this.used_count < this.usage_limit);
};

Coupon.prototype.calculateDiscount = function(amount) {
  if (!this.isValid()) return 0;

  if (this.discount_type === COUPON_TYPES.PERCENTAGE) {
    return Math.floor((amount * this.value) / 100);
  } else {
    return Math.min(this.value, amount);
  }
};

Coupon.prototype.use = function() {
  if (this.isValid()) {
    this.used_count += 1;
    return true;
  }
  return false;
};

export default Coupon;