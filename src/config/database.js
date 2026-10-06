const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(
    env.DB_NAME,
    env.DB_USER,
    env.DB_PASSWORD,
    {
        host: env.DB_HOST,
        port: env.DB_PORT,
        dialect: env.DB_DIALECT,
        logging: false
    }
);

const ensureDatabaseExists = async () => {
    const postgresConnection = new Sequelize(
        'postgres',
        env.DB_USER,
        env.DB_PASSWORD,
        {
            host: env.DB_HOST,
            port: env.DB_PORT,
            dialect: env.DB_DIALECT,
            logging: false
        }
    );

    try {
        const [results] = await postgresConnection.query(
            `SELECT 1 FROM pg_database WHERE datname = '${env.DB_NAME}'`
        );

        if (results.length === 0) {
            await postgresConnection.query(
                `CREATE DATABASE "${env.DB_NAME}"`
            );

            console.log(`Database "${env.DB_NAME}" created successfully.`);
        } else {
            console.log(`Database "${env.DB_NAME}" already exists.`);
        }
    } finally {
        await postgresConnection.close();
    }
};

module.exports = {
    sequelize,
    ensureDatabaseExists
};