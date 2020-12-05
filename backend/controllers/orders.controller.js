const Order = require( "../models/orders.model" );

// create a new Order
exports.create = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    // Create a Order
    const order = new Order( {
        restaurant_id: req.body.restaurant_id,
        user_id: req.body.user_id,
        dish_id: req.body.dish_id,
        total: req.body.total,
        status: "Ordered",
        order_date: new Date(),
        delivery_option: req.body.delivery_option
    } );

    // Save Order in the database
    Order.create( order, ( err, data ) => {
        if ( err ) {
            console.log( err.message )
            res.status( 500 ).send( {
                message:
                    err.message || "Some error occurred while creating the Order."
            } );
            return
        } else res.send( data );
    } );
};

// get all orders for a user
exports.findAllForUsers = ( req, res ) => {
    if ( !req.params.user_id ) {
        res.status( 400 ).send( {
            message: "Please provide user id"
        } );
        return
    }
    Order.getAllForUser( req, ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( {
                message: "Error retrieving Orders"
            } );
            return
        } else {
            console.log( data )
            res.send( data );
            return
        }
    } )
}

// get all orders for a restaurant
exports.findAllForRestaurants = ( req, res ) => {
    if ( !req.params.restaurant_id ) {
        res.status( 400 ).send( {
            message: "Please provide restaurant id"
        } );
        return
    }
    Order.getAllForRestaurant( req, ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( {
                message: "Error retrieving Orders"
            } );
            return
        } else {
            console.log( data )
            res.send( data );
            return
        }
    } )
}

// update order status by id
exports.updateStatus = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }

    Order.updateById(
        req.params.id,
        req.body.updated_status,
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found Order with Id ${ req.params.id }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating Order with Id " + req.params.id
                    } );
                }
            } else res.send( data );
        }
    );
};