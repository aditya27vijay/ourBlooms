'use strict';

import { randomUUID } from 'crypto';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        id: randomUUID(),
        name: 'Bouquets',
        slug: 'bouquets',
        description: 'Beautiful flower bouquets for all occasions',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: randomUUID(),
        name: 'Arrangements',
        slug: 'arrangements',
        description: 'Elegant floral arrangements and centerpieces',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: randomUUID(),
        name: 'Single Stems',
        slug: 'single-stems',
        description: 'Individual flowers and stems',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: randomUUID(),
        name: 'Seasonal',
        slug: 'seasonal',
        description: 'Seasonal and special occasion flowers',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};