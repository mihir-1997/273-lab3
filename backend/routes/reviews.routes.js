module.exports = app => {
    const reviews = require( "../controllers/reviews.controller.js" );

    // Create a new review
    app.post( "/createreview", ( req, res ) => {
        reviews.create( req, res )
    } );

    // Retrieve all reviews for user
    app.get( "/reviewsForUsers/:id", ( req, res ) => {
        reviews.findAllForUsers( req, res )
    } );

    // Retrieve all reviews for restaurant
    app.get( "/reviewsForRestaurants/:id", ( req, res ) => {
        reviews.findAllForRestaurants( req, res )
    } );

    app.get( "/averageRatingsForRestaurant/:id", ( req, res ) => {
        reviews.averageRatingsForRestaurant( req, res )
    } );
    // Retrieve a single reviews with reviewsEmail
    // app.post( "/loginreviews", ( req, res ) => {
    //     reviews.findOne( req, res )
    // } );

    // // Retrieve a single reviews with reviewsId
    // app.get( "/getreviews/:id", ( req, res ) => {
    //     reviews.findOneById( req, res )
    // } );

    // // Update a reviews with reviewsEmail
    // app.put( "/updatereviews/:id", ( req, res ) => {
    //     console.log( `update` )
    //     reviews.update( req, res )
    // } );

    // // Delete a reviews with reviewsEmail
    // app.delete( "/reviewss/:email", ( req, res ) => {
    //     reviews.delete( req, res )
    // } );

};