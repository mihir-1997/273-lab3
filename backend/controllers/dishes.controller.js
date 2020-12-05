const Dish = require( "../models/dishes.model" );

// create a new Dish
exports.create = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    let image_path = null
    if ( req.file ) {
        if ( req.file.path ) {
            image_path = req.file.path
        }
    }
    // Create a Dish
    const dish = new Dish( {
        restaurant_id: req.body.restaurant_id,
        name: req.body.name,
        ingredients: req.body.ingredients,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        cuisine: req.body.cuisine,
        image: image_path
    } );

    // Save Dish in the database
    Dish.create( dish, ( err, data ) => {
        if ( err ) {
            console.log( err.message )
            res.status( 500 ).send( {
                message:
                    err.message || "Some error occurred while creating the Dish."
            } );
            return
        } else res.send( data );
    } );
};

// get all dishes
exports.findAll = ( req, res ) => {
    Dish.findAll( req, ( err, data ) => {
        if ( err ) {
            res.status( 500 ).send( {
                message: "Error retrieving Dish"
            } );
            return
        } else {
            console.log( data )
            res.send( data );
        }
    } )
}

// find one Dish by id
exports.findOne = ( req, res ) => {
    if ( !req.body.email && !req.body.password ) {
        res.status( 400 ).send( {
            message: "Each field is required"
        } );
        return
    }
    Dish.findByEmail( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No Dish found`
                } );
                return
            } else if ( err.kind === "wrong_password" ) {
                res.status( 401 ).send( {
                    message: "Wrong Password"
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving Dish"
                } );
                return
            }
        } else res.send( data );
    } );
};

// find one dish by id
exports.findOneById = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    Dish.findById( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No Dish found`
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving Dish"
                } );
                return
            }
        } else res.send( data );
    } );
};

// update one Dish by id
exports.update = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }

    Dish.updateById(
        req.params.id,
        req,
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found Dish with Id ${ req.params.id }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating Dish with Id " + req.params.id
                    } );
                }
            } else res.send( data );
        }
    );
};

// update Dish profile by id
exports.addPictures = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    Dish.addPictures(
        req.body.id,
        req.files,
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found Dish with Id ${ req.params.id }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating Dish profile with Id " + req.params.id
                    } );
                }
            } else res.send( data );
        }
    );
}

// delete one Dish by id
exports.delete = ( req, res ) => {
    Dish.remove( req.params.email, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `Not found Dish with id ${ req.params.email }.`
                } );
            } else {
                res.status( 500 ).send( {
                    message: "Could not delete Dish with id " + req.params.email
                } );
            }
        } else res.send( { message: `Dish was deleted successfully!` } );
    } );
};