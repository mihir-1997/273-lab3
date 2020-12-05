module.exports = app => {
    const Orders = require( "../controllers/orders.controller" );

    // Create Order
    app.post( "/createOrder", ( req, res ) => {
        Orders.create( req, res )
    } );

    // Retrieve all orders for users
    app.get( "/getUserOrders/:user_id", ( req, res ) => {
        Orders.findAllForUsers( req, res )
    } );

    // Retrieve all orders for restaurants
    app.get( "/getRestaurantOrders/:restaurant_id", ( req, res ) => {
        Orders.findAllForRestaurants( req, res )
    } );

    // Update order status
    app.put( "/updateOrderStatus/:id", ( req, res ) => {
        Orders.updateStatus( req, res )
    } );

};