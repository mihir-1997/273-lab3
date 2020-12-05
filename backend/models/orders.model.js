const sql = require( "./db.js" );

// constructor
const Order = function ( Order ) {
    this.restaurant_id = Order.restaurant_id;
    this.user_id = Order.user_id;
    this.dish_id = Order.dish_id;
    this.total = Order.total;
    this.status = Order.status;
    this.order_date = Order.order_date;
    this.delivery_option = Order.delivery_option;
};

Order.create = ( newOrder, result ) => {
    sql.query( "INSERT INTO orders SET ?", newOrder, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        console.log( "created Dish: ", { id: res.insertId, ...newOrder } );
        result( null, { id: res.insertId, ...newOrder } );
    } );
};

Order.getAllForUser = ( req, result ) => {
    sql.query( `SELECT o.id, o.total, o.status, o.order_date, r.name as restaurant_name, d.name as dish_name FROM orders o INNER JOIN restaurants r ON o.restaurant_id=r.id INNER JOIN dishes d on o.dish_id=d.id INNER JOIN users u on o.user_id=u.id where o.user_id=${ req.params.user_id } ORDER BY o.order_date DESC`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        if ( res.length ) {
            console.log( "orders: ", res );
            result( null, res );
            return
        } else {
            console.log( "no orders found" )
            return
        }
    } );
};

Order.getAllForRestaurant = ( req, result ) => {
    sql.query( `SELECT o.id, o.total, o.status, o.order_date, o.delivery_option, u.id as user_id, u.name as user_name, d.name as dish_name FROM orders o INNER JOIN users u ON o.user_id=u.id INNER JOIN dishes d on o.dish_id=d.id INNER JOIN restaurants r on o.restaurant_id=r.id where o.restaurant_id=${ req.params.restaurant_id } ORDER BY o.order_date DESC`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        if ( res.length ) {
            console.log( "orders: ", res );
            result( null, res );
            return
        } else {
            console.log( "no orders found" )
            return
        }
    } );
};

Order.updateById = ( id, updated_status, result ) => {
    sql.query(
        "UPDATE orders SET status = ? WHERE id = ?",
        [ updated_status, id ],
        ( err, res ) => {
            if ( err ) {
                console.log( "error: ", err );
                result( null, err );
                return;
            }

            if ( res.affectedRows == 0 ) {
                // not found User with the email
                result( { kind: "not_found" }, null );
                return;
            }
            result( null, { message: "Updated" } );
        }
    );
};

module.exports = Order;