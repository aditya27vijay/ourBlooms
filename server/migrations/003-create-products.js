'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      price_paise: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      images: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true,
        defaultValue: []
      },
      stock_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_seasonal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      available_from: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      available_until: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('products', ['slug'], { unique: true });
    await queryInterface.addIndex('products', ['category_id']);
    await queryInterface.addIndex('products', ['is_seasonal']);
    await queryInterface.addIndex('products', ['available_from', 'available_until']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};