const sql = require( "./db.js" );
var passwordHash = require( 'password-hash' );
const NodeGeocoder = require( 'node-geocoder' );
require( 'dotenv' ).config(
    { path: "../../.env" }
);

const options = {
    provider: 'google',
    apiKey: process.env.GOOGLE_API_KEY,
    formatter: null
};
const geocoder = NodeGeocoder( options );

// constructor
const Restaurant = function ( Restaurant ) {
    this.name = Restaurant.name;
    this.email = Restaurant.email;
    this.address = Restaurant.address;
    this.city = Restaurant.city;
    this.state = Restaurant.state;
    this.zipcode = Restaurant.zipcode;
    this.phone_no = Restaurant.phone_no;
    this.description = Restaurant.description;
    this.timings = Restaurant.timings;
    this.pictures = Restaurant.pictures;
    this.curbside_pickup = Restaurant.curbside_pickup;
    this.dine_in = Restaurant.dine_in;
    this.delivery = Restaurant.delivery;
    this.password = Restaurant.password;
    this.latitude = Restaurant.latitude;
    this.longitude = Restaurant.longitude;
};

Restaurant.getLatitudeLongitude = async ( address, zipcode ) => {
    const latitudeLongitude = await geocoder.geocode( {
        address: address,
        countryCode: 'us',
        zipcode: zipcode
    } );
    let latitude = null
    let longitude = null
    if ( latitudeLongitude ) {
        latitude = latitudeLongitude[ 0 ].latitude
        longitude = latitudeLongitude[ 0 ].longitude
    }
    return { latitude: latitude, longitude: longitude }
}

Restaurant.create = ( newRestaurant, result ) => {
    delete newRestaurant[ "pictures" ]
    sql.query( "INSERT INTO restaurants SET ?", newRestaurant, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        console.log( "created Restaurant: ", { id: res.insertId, ...newRestaurant } );
        result( null, { id: res.insertId, ...newRestaurant } );
    } );
};

Restaurant.findByEmail = ( req, result ) => {
    sql.query( `SELECT * FROM restaurants WHERE email = \'${ req.body.email }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        if ( res.length ) {
            console.log( "found Restaurant: ", res[ 0 ] );
            if ( passwordHash.verify( req.body.password, res[ 0 ].password ) ) {
                result( null, res[ 0 ] );
                return;
            } else {
                result( { kind: "wrong_password" }, null );
                return
            }
        }

        // not found Restaurant with the Email
        result( { kind: "not_found" }, null );
        return
    } );
};

Restaurant.findById = ( req, result ) => {
    var restaurant = null
    var error = false
    sql.query( `SELECT * FROM restaurants WHERE id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            console.log( "found Restaurant: ", res[ 0 ] );
            let { password, ...alldata } = res[ 0 ]
            restaurant = alldata
            sql.query( `SELECT * FROM restaurant_images WHERE restaurant_id = \'${ req.params.id }\'`, ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( err, null );
                    return;
                }
                if ( res.length ) {
                    console.log( "found Restaurant Pictures: ", res );
                    let images = []
                    res.forEach( r => {
                        let { image, ...restdata } = r
                        images.push( image )
                    } )
                    restaurant[ "pictures" ] = images
                    result( null, restaurant )
                    return;
                } else {
                    // not found Restaurant with the id
                    result( null, restaurant )
                    return;
                }
            } );
        } else {
            // not found Restaurant with the id
            console.log( "error: ", null );
            return;
        }
    } );
};

Restaurant.getAll = ( req, result ) => {
    sql.query( "SELECT r.id, r.name, r.address, r.city, r.state, r.zipcode, r.email, r.phone_no, r.description, r.timings, r.curbside_pickup, r.dine_in, r.delivery, r.latitude, r.longitude, ri.image FROM restaurants r LEFT JOIN restaurant_images ri on r.id = ri.restaurant_id", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }
        if ( res.length ) {
            const filtered_data = [];
            const latLongs = []
            const map = new Map();
            for ( const item of res ) {
                if ( !map.has( item.id ) ) {
                    map.set( item.id, true );
                    const { latitude, longitude, ...alldata } = item
                    latLongs.push( {
                        id: item.id,
                        name: item.name,
                        lat: latitude,
                        lng: longitude
                    } )
                    filtered_data.push( alldata );
                }
            }

            result( null, { restaurants: filtered_data, latlongs: latLongs } );
            return
        }
        console.log( "Restaurants: ", res );
        result( null, res );
    } );
};

Restaurant.updateById = ( id, Restaurant, result ) => {
    Restaurant.curbside_pickup = Restaurant.curbside_pickup ? 1 : 0
    Restaurant.dine_in = Restaurant.dine_in ? 1 : 0
    Restaurant.delivery = Restaurant.delivery ? 1 : 0
    sql.query(
        "UPDATE restaurants SET name = ?, email = ?, address = ?, city = ?, state = ?, zipcode = ?, phone_no = ?, description = ?, timings = ?, curbside_pickup = ?, dine_in = ?, delivery = ?, latitude = ?, longitude = ? WHERE id = ?",
        [ Restaurant.name, Restaurant.email, Restaurant.address, Restaurant.city, Restaurant.state, Restaurant.zipcode, Restaurant.phone_no, Restaurant.description, Restaurant.timings, parseInt( Restaurant.curbside_pickup, 10 ), parseInt( Restaurant.dine_in, 10 ), parseInt( Restaurant.delivery, 10 ), Restaurant.latitude, Restaurant.longitude, id ],
        ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }

            if ( res.affectedRows == 0 ) {
                result( { kind: "not_found" }, null );
                return;
            }

            console.log( "updated Restaurant: ", { id: id, ...Restaurant } );
            result( null, { id: id, ...Restaurant } );
        }
    );
};

Restaurant.addPictures = ( id, files, result ) => {
    let error = false
    files.forEach( ( file ) => {
        sql.query(
            "INSERT INTO restaurant_images SET restaurant_id = ?, image = ?",
            [ id, file.path ],
            ( err, res ) => {
                if ( err ) {
                    console.log( "error: ", err );
                    result( null, err );
                    return;
                }

                if ( res.affectedRows == 0 ) {
                    error = true
                }
                console.log( res )
            }
        );
    } )
    if ( !error ) {
        result( null, { message: "picture added" } );
        return
    }
};

Restaurant.findOneImageById = ( req, result ) => {
    sql.query( `SELECT * FROM restaurant_images WHERE restaurant_id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }
        if ( res.length ) {
            result( null, res[ 0 ] );
            return
        }
        result( null, res );
    } );
}


Restaurant.findBySearchCategory = ( req, result ) => {
    if ( req.params.category === "cuisine" || req.params.category === "dish" ) {
        if ( req.params.category === "dish" ) {
            req.params.category = "name"
        }
        sql.query( `SELECT r.id from restaurants r INNER JOIN dishes d ON d.restaurant_id=r.id where d.${ req.params.category } like \'%${ req.params.searchterm }%\'`, ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }
            if ( res.length ) {
                const filtered_data = [];
                const map = new Map();
                for ( const item of res ) {
                    if ( !map.has( item.id ) ) {
                        map.set( item.id, true );
                        filtered_data.push( item.id );
                    }
                }
                result( null, filtered_data );
                return
            } else {
                result( { kind: "not_found" }, null );
                return
            }
        } );
    } else if ( req.params.category === "location" ) {
        sql.query( `SELECT distinct(id) from restaurants where city like \'%${ req.params.searchterm }%\'`, ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }
            if ( res.length ) {
                let filtered_data = Array.from( res, x => x.id )
                result( null, filtered_data );
                return
            } else {
                result( { kind: "not_found" }, null );
                return
            }
        } );
    }
    return
}

Restaurant.remove = ( email, result ) => {
    sql.query( "DELETE FROM restaurants WHERE email = ?", email, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        if ( res.affectedRows == 0 ) {
            // not found Restaurant with the email
            result( { kind: "not_found" }, null );
            return;
        }

        console.log( "deleted Restaurant with email: ", email );
        result( null, res );
    } );
};

Restaurant.removeAll = result => {
    sql.query( "DELETE FROM restaurants", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        console.log( `deleted ${ res.affectedRows } Restaurants` );
        result( null, res );
    } );
};

module.exports = Restaurant;