// get frontend url and port from environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost"
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000

const express = require( "express" );
const bodyParser = require( "body-parser" );

const app = express();
const { graphqlHTTP } = require( 'express-graphql' );
require( 'dotenv' ).config(
);
// express session
var session = require( 'express-session' );
var cookieParser = require( 'cookie-parser' );
var cors = require( "cors" );
const multer = require( "multer" );
const path = require( 'path' )

// use body parser to parse JSON and urlencoded request bodies
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
// use cookie parser to parse request headers
app.use( cookieParser() );
app.use( cors( { origin: FRONTEND_URL + ":" + FRONTEND_PORT } ) );

// use session to store user data between HTTP requests
app.use( session( {
    name: '',
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
} ) );

app.use( '/Profiles', express.static( path.join( __dirname, '/Profiles' ) ) );
app.use( '/RestaurantImages', express.static( path.join( __dirname, '/RestaurantImages' ) ) );
app.use( '/DishImages', express.static( path.join( __dirname, '/DishImages' ) ) );

// custom errors and statuscodes
const getError = require( './exceptions/getError' )

// user schema
const schema = require( './schema/schema' );

// custom error function
const customFormatErrorFn = ( err ) => {
    const error = getError( err.message )
    if ( error !== undefined ) {
        return ( {
            message: error.message,
            statusCode: error.statusCode
        } )
    } else {
        return err
    }
}

// graphql route
app.use( "/graphql", graphqlHTTP( {
    schema,
    graphiql: true,
    customFormatErrorFn: ( err ) => customFormatErrorFn( err )
} ) );

// set port, listen for requests
app.listen( 3001, () => {
    console.log( "Server is running on port 3001." );
} );