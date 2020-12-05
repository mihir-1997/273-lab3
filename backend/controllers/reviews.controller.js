const Review = require( "../models/reviews.model.js" );

exports.create = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    // create a review
    console.log( req.body )
    const newReview = new Review( {
        user_id: req.body.user_id,
        restaurant_id: req.body.restaurant_id,
        review_text: req.body.review_text,
        ratings: req.body.ratings,
        date: new Date()
    } )
    console.log( newReview )
    Review.create( newReview, ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( {
                message: "Error retrieving reviews"
            } );
            return
        } else res.send( data );
    } )
}

// find reviews by user_id
exports.findAllForUsers = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Review.findByUserId( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: "No reviews found"
                    } );
                    return
                }
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving reviews"
                } );
                return
            }
        } else res.send( data );
    } );
};

exports.findAllForRestaurants = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Review.findByRestaurantId( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: "No reviews found"
                    } );
                    return
                }
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving reviews"
                } );
                return
            }
        } else res.send( data );
    } );
};

exports.averageRatingsForRestaurant = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Review.averageRatingsForRestaurant( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: "No reviews found"
                    } );
                    return
                }
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving reviews"
                } );
                return
            }
        } else res.send( data );
    } );
};