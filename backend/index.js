// get frontend url and port from environment variables
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost"
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000

const express = require( "express" );
const bodyParser = require( "body-parser" );

const app = express();
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
app.use( cors( { origin: FRONTEND_URL + ":" + FRONTEND_PORT, credentials: true } ) );

// use session to store user data between HTTP requests
app.use( session( {
    name: '',
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
} ) );

// import user defined function
const users = require( "./controllers/user.controller" );
const restaurants = require( "./controllers/restaurant.controller" );
const dishes = require( "./controllers/dishes.controller" );

app.use( '/Profiles', express.static( path.join( __dirname, '/Profiles' ) ) );
app.use( '/RestaurantImages', express.static( path.join( __dirname, '/RestaurantImages' ) ) );
app.use( '/DishImages', express.static( path.join( __dirname, '/DishImages' ) ) );

// simple route
app.get( "/", ( req, res ) => {
    res.json( { message: "Welcome to bezkoder application." } );
} );

// users routes
require( "./routes/user.routes" )( app );

// restaurants routes
require( "./routes/restaurant.routes" )( app );

// dishes routes
require( "./routes/dishes.routes" )( app );

// reviews routes
require( "./routes/reviews.routes" )( app );

// orders routes
require( "./routes/orders.routes" )( app );

const storage = multer.diskStorage( {
    destination: function ( req, file, cb ) {
        cb( null, 'Profiles/' )
    },
    filename: function ( req, file, callback ) {
        callback( null, file.originalname.split( "." )[ 0 ].substring( 0, 10 ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
} );

const upload = multer( {
    storage: storage,
} )

app.post( "/updateProfile", upload.single( "file" ), ( req, res ) => {
    console.log( req.body.id )
    console.log( req.file )
    users.updateProfile( req, res )
} );

const restaurantStorage = multer.diskStorage( {
    destination: function ( req, file, cb ) {
        cb( null, 'RestaurantImages/' )
    },
    filename: function ( req, file, callback ) {
        callback( null, file.originalname.split( "." )[ 0 ].substring( 0, 10 ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
} );

const restaurantPictures = multer( {
    storage: restaurantStorage
} )

app.post( "/restaurantPictures", restaurantPictures.array( 'file' ), ( req, res ) => {
    console.log( req.body.id )
    console.log( req.files )
    restaurants.addPictures( req, res )
} );

const dishStorage = multer.diskStorage( {
    // destination: '/uploads/',
    destination: function ( req, file, cb ) {
        cb( null, 'DishImages/' )
    },
    filename: function ( req, file, callback ) {
        callback( null, file.originalname.split( "." )[ 0 ].substring( 0, 10 ) + '-' + Date.now() + path.extname( file.originalname ) )
    }
} );

const dishPicture = multer( {
    storage: dishStorage
} )

// Create a new Dish
app.post( "/createDish", dishPicture.single( "file" ), ( req, res ) => {
    console.log( req.file )
    dishes.create( req, res )
} );

// Update a Dish with DishId
app.put( "/updateDish/:id", dishPicture.single( "file" ), ( req, res ) => {
    console.log( `update` )
    dishes.update( req, res )
} );

// set port, listen for requests
app.listen( 3001, () => {
    console.log( "Server is running on port 3001." );
} );