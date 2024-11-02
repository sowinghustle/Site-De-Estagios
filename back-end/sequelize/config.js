module.exports = {
    development: {
        dialect: 'sqlite',
        storage: ':memory:',
    },
    test: {
        dialect: 'sqlite',
        storage: ':memory:',
    },
    production: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        dialect: process.env.DB_TYPE,
        seederStorage: 'sequelize',
    },
};
