'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Password@123', 12);

    await queryInterface.bulkInsert('users', [
      {
        role: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        suspended: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role: 'teacher',
        name: 'Teacher User',
        email: 'teacher@example.com',
        password: hashedPassword,
        suspended: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        role: 'student',
        name: 'Student User',
        email: 'student@example.com',
        password: hashedPassword,
        suspended: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: ['admin@example.com', 'teacher@example.com', 'student@example.com'],
    });
  },
};
