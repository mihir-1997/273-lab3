const mysql = require( 'mysql' );
const dbConfig = require( '../config/db.config' )

// Create database connection
const connection = mysql.createConnection( {
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
} );

var pool = mysql.createPool( {
    connectionLimit: 10,
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
} );

// Open a database connection
connection.connect( error => {
    if ( error ) throw error;
    console.log( "Successfully connected to the database." );
} );

// Open a database connection using pool
pool.getConnection( error => {
    if ( error ) throw error;
    console.log( "Successfully connected to the database." );
} );

// To handle "ECONNRESET" (Keep mysql connection alive)
function keepAlive () {
    connection.query( "select 1", ( err, res ) => {
        if ( err ) {
            console.log( "Keepalive error: ", err );
            return;
        }
        console.log( res )
    } );
}
setInterval( keepAlive, 300000 )

module.exports = pool;