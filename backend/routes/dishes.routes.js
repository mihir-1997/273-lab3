module.exports = app => {
    const Dishes = require( "../controllers/dishes.controller" );

    // Retrieve all Dishes
    app.get( "/dishes/:restaurant_id", ( req, res ) => {
        Dishes.findAll( req, res )
    } );

    // Retrieve a single Dish with DishesId
    app.get( "/getDish/:id", ( req, res ) => {
        Dishes.findOneById( req, res )
    } );

    // Delete a Dish with DishEmail
    app.delete( "/Dishes/:email", ( req, res ) => {
        Dishes.delete( req, res )
    } );

};