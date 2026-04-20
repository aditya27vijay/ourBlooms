'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_slots', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      time_window: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'e.g., "9:00 AM - 11:00 AM"'
      },
      max_orders: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 50
      },
      booked: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.addIndex('delivery_slots', ['date', 'time_window'], { unique: true });
    await queryInterface.addIndex('delivery_slots', ['date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('delivery_slots');
  }
};