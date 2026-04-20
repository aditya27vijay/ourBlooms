import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import { slugify } from '../utils/slugify.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'categories',
  indexes: [
    {
      unique: true,
      fields: ['name']
    },
    {
      unique: true,
      fields: ['slug']
    }
  ],
  hooks: {
    beforeValidate: (category) => {
      if (category.name && !category.slug) {
        category.slug = slugify(category.name);
      }
    }
  }
});

export default Category;