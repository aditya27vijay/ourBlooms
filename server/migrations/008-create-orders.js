'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
      },
      total_paise: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      delivery_slot_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'delivery_slots',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      address_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      payment_provider: {
        type: Sequelize.ENUM('razorpay', 'stripe', 'cod'),
        defaultValue: 'razorpay',
        allowNull: false
      },
      payment_ref: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Payment gateway reference ID'
      },
      gift_message: {
        type: Sequelize.TEXT,
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
    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['delivery_slot_id']);
    await queryInterface.addIndex('orders', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};