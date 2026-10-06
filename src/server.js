const app = require('./app');
const {
    sequelize,
    ensureDatabaseExists
} = require('./config/database');
const env = require('./config/env');

require('./models');

const startServer = async () => {
    try {
        await ensureDatabaseExists();

        await sequelize.authenticate();

        console.log('Database connection established successfully.');

        await sequelize.sync({
            alter: process.env.NODE_ENV === 'development'
        });

        console.log('Database synchronized successfully.');

        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });

    } catch (error) {
        console.error('Unable to start application:');
        console.error(error.message);

        process.exit(1);
    }
};

startServer();