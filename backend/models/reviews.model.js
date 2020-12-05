const sql = require( "./db.js" );

const Review = function ( Review ) {
    this.user_id = Review.user_id;
    this.restaurant_id = Review.restaurant_id;
    this.review_text = Review.review_text;
    this.ratings = Review.ratings;
    this.date = Review.date;
}

Review.create = ( newReview, result ) => {
    console.log( newReview )
    sql.query( "INSERT INTO reviews SET ?", newReview, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        result( null, { id: res.insertId, ...newReview } );
    } );
}

Review.findByUserId = ( req, result ) => {

    sql.query( `SELECT reviews.*, restaurants.name, restaurants.address as restaurant_address, restaurants.city as restaurant_city, restaurants.state as restaurant_state, restaurants.zipcode as restaurant_zipcode FROM reviews INNER JOIN restaurants ON reviews.restaurant_id = restaurants.id WHERE reviews.user_id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            result( null, res )
            return
        }
        result( { kind: "not_found" }, null );
        return
    } );

}

Review.findByRestaurantId = ( req, result ) => {
    sql.query( `SELECT reviews.*, users.name, users.city, users.state FROM reviews INNER JOIN users ON reviews.user_id = users.id WHERE reviews.restaurant_id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            result( null, res )
            return
        }
        result( { kind: "not_found" }, null );
        return
    } );
}

Review.averageRatingsForRestaurant = ( req, result ) => {
    sql.query( `select count(*) as num_of_reviews, CAST(AVG(ratings) AS DECIMAL(10,2)) as ratings from reviews where restaurant_id= \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            console.log( "ratings: " + res[ 0 ] )
            result( null, res[ 0 ] )
            return
        }
        result( { kind: "not_found" }, null );
        return
    } );
}

module.exports = Review;