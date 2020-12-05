require( 'dotenv' ).config(
    { path: "../../.env" }
);

const DATABASE_HOST = process.env.DATABASE_HOST
const DATABASE_USER = process.env.DATABASE_USER
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD
const DATABASE = process.env.DATABASE

module.exports = {
    HOST: DATABASE_HOST,
    USER: DATABASE_USER,
    PASSWORD: DATABASE_PASSWORD,
    DB: DATABASE
};