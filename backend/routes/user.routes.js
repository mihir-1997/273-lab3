module.exports = app => {
    const users = require( "../controllers/user.controller.js" );

    // Create a new User
    app.post( "/registerUser", ( req, res ) => {
        users.create( req, res )
    } );

    // Retrieve all users
    app.get( "/users", ( req, res ) => {
        users.findAll( req, res )
    } );

    // Retrieve a single User with UserEmail
    app.post( "/loginUser", ( req, res ) => {
        users.findOne( req, res )
    } );

    // Retrieve a single User with UserId
    app.get( "/getuser/:id", ( req, res ) => {
        users.findOneById( req, res )
    } );

    // Update a User with UserEmail
    app.put( "/updateUser/:id", ( req, res ) => {
        console.log( `update` )
        users.update( req, res )
    } );

    // Delete a User with UserEmail
    app.delete( "/users/:email", ( req, res ) => {
        users.delete( req, res )
    } );

};