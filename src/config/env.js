const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    PORT: process.env.PORT || 4000,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DIALECT: process.env.DB_DIALECT || 'postgres',
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "2h",
};