'use strict';

const config = require('../../dist/config/index.js').default;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const users = await queryInterface.bulkInsert(
                'users',
                [
                    {
                        email: config.instituition.adminEmail,
                        password:
                            await config.instituition.encryptedAdminPassword,
                        role: 'admin',
                    },
                ],
                { returning: true, transaction }
            );

            await queryInterface.bulkInsert(
                'admins',
                [
                    {
                        name: config.instituition.adminName,
                        userId: users[0].id,
                    },
                ],
                { transaction }
            );
        });
    },

    async down(queryInterface, Sequelize) {
        const user = await queryInterface.rawSelect(
            'users',
            {
                where: { email: config.instituition.adminEmail },
            },
            ['id']
        );

        if (user) {
            await queryInterface.bulkDelete('admins', { userId: user });
            await queryInterface.bulkDelete('users', { id: user });
        }
    },
};
