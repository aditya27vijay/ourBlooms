'use strict';

import { randomUUID } from 'crypto';

export default {
  async up(queryInterface, Sequelize) {
    // Hash the password "admin123"
    const bcrypt = await import('bcryptjs');
    const passwordHash = await bcrypt.default.hash('admin123', 12);

    await queryInterface.bulkInsert('users', [{
      id: randomUUID(),
      email: 'admin@ourblooms.com',
      password_hash: passwordHash,
      name: 'Admin User',
      role: 'admin',
      phone: '+91-9876543210',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'admin@ourblooms.com' }, {});
  }
};