'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('access-tokens', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
                allowNull: true,
            },
            expiredAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("NOW() + INTERVAL '1 DAY'"),
            },
            createdAt: {
                type: Sequelize.TIME,
                allowNull: false,
                defaultValue: new Date(),
            },
            updatedAt: {
                type: Sequelize.TIME,
                allowNull: true,
                defaultValue: null,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('access-tokens');
    },
};
