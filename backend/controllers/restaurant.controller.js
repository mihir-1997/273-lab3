const Restaurant = require( "../models/restaurant.model" );
var passwordHash = require( 'password-hash' );

// create a new Restaurant
exports.create = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    const hashedPassword = passwordHash.generate( req.body.password );
    const latLong = Restaurant.getLatitudeLongitude( req.body.address, req.body.zipcode )
    console.log( "----" )
    console.log( "latitude and longitude" )
    console.log( latLong )
    console.log( "----" )
    // Create a Restaurant
    const restaurant = new Restaurant( {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipcode: req.body.zipcode,
        phone_no: req.body.phone_no,
        description: req.body.description,
        timings: req.body.timings,
        curbside_pickup: req.body.curbside_pickup,
        dine_in: req.body.dine_in,
        delivery: req.body.delivery,
        password: hashedPassword,
        latitude: latLong.latitude,
        longitude: latLong.longitude,
    } );

    // Save Restaurant in the database
    Restaurant.create( restaurant, ( err, data ) => {
        if ( err ) {
            console.log( err.message )
            if ( err.code === "ER_DUP_ENTRY" ) {
                res.status( 409 ).send( {
                    message: "Restaurant already exist"
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message:
                        err.message || "Some error occurred while creating the Restaurant."
                } );
                return
            }
        } else res.send( data );
    } );
};

// find one Restaurant by id
exports.findOne = ( req, res ) => {
    if ( !req.body.email && !req.body.password ) {
        res.status( 400 ).send( {
            message: "Each field is required"
        } );
        return
    }
    Restaurant.findByEmail( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No Restaurant found`
                } );
                return
            } else if ( err.kind === "wrong_password" ) {
                res.status( 401 ).send( {
                    message: "Wrong Password"
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving Restaurant"
                } );
                return
            }
        } else res.send( data );
    } );
};

// find one restaurant by id
exports.findOneById = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Restaurant.findById( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No restaurant found`
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving restaurant"
                } );
                return
            }
        } else res.send( data );
    } );
};

// find all restaurants
exports.findAll = ( req, res ) => {
    Restaurant.getAll( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No restaurant found`
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving restaurant"
                } );
                return
            }
        } else res.send( data );
    } );
};

// update one Restaurant by id
exports.update = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    Restaurant.getLatitudeLongitude( req.body.address, req.body.zipcode ).then( ( data ) => {
        req.body.latitude = data.latitude
        req.body.longitude = data.longitude
        console.log( req.body )
        Restaurant.updateById(
            req.params.id,
            new Restaurant( req.body ),
            ( err, data ) => {
                if ( err ) {
                    if ( err.kind === "not_found" ) {
                        res.status( 404 ).send( {
                            message: `Not found Restaurant with Id ${ req.params.id }.`
                        } );
                    } else {
                        res.status( 500 ).send( {
                            message: "Error updating Restaurant with Id " + req.params.id
                        } );
                    }
                } else res.send( data );
            }
        );
    } )
};

// update restaurant profile by id
exports.addPictures = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    Restaurant.addPictures(
        req.body.id,
        req.files,
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found Restaurant with Id ${ req.params.id }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating Restaurant profile with Id " + req.params.id
                    } );
                }
            } else res.send( data );
        }
    );
}

exports.findOneImageById = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Restaurant.findOneImageById( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No restaurant found`
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving restaurant"
                } );
                return
            }
        } else res.send( data );
    } );
}

exports.findRestaurantsBySearchCategory = ( req, res ) => {
    if ( !req.params.category && !req.params.searchterm ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Restaurant.findBySearchCategory( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No restaurant found`
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving restaurant"
                } );
                return
            }
        } else res.send( data );
    } );
}

// delete one Restaurant by id
exports.delete = ( req, res ) => {
    Restaurant.remove( req.params.email, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `Not found Restaurant with id ${ req.params.email }.`
                } );
            } else {
                res.status( 500 ).send( {
                    message: "Could not delete Restaurant with id " + req.params.email
                } );
            }
        } else res.send( { message: `Restaurant was deleted successfully!` } );
    } );
};