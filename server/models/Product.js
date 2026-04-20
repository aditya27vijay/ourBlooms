import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { slugify } from '../utils/slugify.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price_paise: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true,
    defaultValue: []
  },
  stock_qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  is_seasonal: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  available_from: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  available_until: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'products',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['is_seasonal']
    },
    {
      fields: ['available_from', 'available_until']
    }
  ],
  hooks: {
    beforeValidate: (product) => {
      if (product.name && !product.slug) {
        product.slug = slugify(product.name);
      }
    }
  }
});

// Virtual fields
Product.prototype.getPriceRupees = function() {
  return this.price_paise / 100;
};

Product.prototype.isAvailable = function() {
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];

  if (!this.is_seasonal) return true;

  if (this.available_from && currentDate < this.available_from) return false;
  if (this.available_until && currentDate > this.available_until) return false;

  return true;
};

export default Product;