const User = require( "../models/user.model.js" );
var passwordHash = require( 'password-hash' );
const multer = require( "multer" );
const fs = require( 'fs' )

// create a new user
exports.create = ( req, res ) => {
    // validate request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    const hashedPassword = passwordHash.generate( req.body.password );
    // Create a User
    const user = new User( {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        nick_name: req.body.nick_name,
        birthdate: req.body.birthdate,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        website: req.body.website,
        headline: req.body.headline,
        profile_picture: req.body.profile_picture,
        yelping_since: req.body.yelping_since,
        things_love: req.body.things_love,
        find_me: req.body.find_me,
        password: hashedPassword
    } );

    // Save User in the database
    User.create( user, ( err, data ) => {
        if ( err ) {
            console.log( err.message )
            if ( err.code === "ER_DUP_ENTRY" ) {
                res.status( 409 ).send( {
                    message: "User already exist"
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message:
                        err.message || "Some error occurred while creating the User."
                } );
                return
            }
        } else res.send( data );
    } );
};

// find one user by email
exports.findOne = ( req, res ) => {
    if ( !req.body.email && !req.body.password ) {
        res.status( 400 ).send( {
            message: "Each field is required"
        } );
        return
    }
    User.findByEmail( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No user found`
                } );
                return
            } else if ( err.kind === "wrong_password" ) {
                res.status( 401 ).send( {
                    message: "Wrong Password"
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving user"
                } );
                return
            }
        } else res.send( data );
    } );
};

// find one user by id
exports.findOneById = ( req, res ) => {
    if ( !req.params.id ) {
        res.status( 400 ).send( {
            message: "Please provide Id"
        } );
        return
    }
    User.findById( req, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `No user found`
                } );
                return
            } else {
                res.status( 500 ).send( {
                    message: "Error retrieving user"
                } );
                return
            }
        } else res.send( data );
    } );
};

// update one user by id
exports.update = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }

    User.updateById(
        req.params.id,
        new User( req.body ),
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found User with Id ${ req.params.id }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating User with Id " + req.params.id
                    } );
                }
            } else res.send( data );
        }
    );
};

// update user profile by id
exports.updateProfile = ( req, res ) => {
    // validate Request
    if ( !req.body ) {
        res.status( 400 ).send( {
            message: "Content can not be empty!"
        } );
    }
    User.updateProfile(
        req.body.id,
        req.file.path,
        ( err, data ) => {
            if ( err ) {
                if ( err.kind === "not_found" ) {
                    res.status( 404 ).send( {
                        message: `Not found User with Id ${ req.params.id }.`
                    } );
                } else {
                    res.status( 500 ).send( {
                        message: "Error updating User profile with Id " + req.params.id
                    } );
                }
            } else res.send( data );
        }
    );
}

// delete one user by id
exports.delete = ( req, res ) => {
    User.remove( req.params.email, ( err, data ) => {
        if ( err ) {
            if ( err.kind === "not_found" ) {
                res.status( 404 ).send( {
                    message: `Not found User with id ${ req.params.email }.`
                } );
            } else {
                res.status( 500 ).send( {
                    message: "Could not delete User with id " + req.params.email
                } );
            }
        } else res.send( { message: `User was deleted successfully!` } );
    } );
};