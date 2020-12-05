const sql = require( "./db.js" );
var passwordHash = require( 'password-hash' );

// constructor
const User = function ( User ) {
    this.name = User.name;
    this.email = User.email;
    this.phone_no = User.phone_no;
    this.nick_name = User.nick_name;
    this.birthdate = User.birthdate;
    this.city = User.city;
    this.state = User.state;
    this.country = User.country;
    this.website = User.website;
    this.headline = User.headline;
    this.profile_picture = User.profile_picture;
    this.yelping_since = User.yelping_since;
    this.things_love = User.things_love;
    this.find_me = User.find_me;
    this.password = User.password
};

User.create = ( newUser, result ) => {
    sql.query( "INSERT INTO users SET ?", newUser, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        console.log( "created User: ", { id: res.insertId, ...newUser } );
        result( null, { id: res.insertId, ...newUser } );
    } );
};

User.findByEmail = ( req, result ) => {
    console.log( req.body )
    sql.query( `SELECT * FROM users WHERE email = \'${ req.body.email }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }

        if ( res.length ) {
            console.log( "found User: ", res[ 0 ] );
            if ( passwordHash.verify( req.body.password, res[ 0 ].password ) ) {
                result( null, res[ 0 ] );
                return;
            } else {
                result( { kind: "wrong_password" }, null );
                return
            }
        }

        // not found User with the Email
        result( { kind: "not_found" }, null );
        return
    } );
};

User.findById = ( req, result ) => {
    sql.query( `SELECT * FROM users WHERE id = \'${ req.params.id }\'`, ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( err, null );
            return;
        }
        if ( res.length ) {
            console.log( "found User: ", res[ 0 ] );
            let { password, ...alldata } = res[ 0 ]
            result( null, alldata );
            return;
        }
        // not found User with the id
        result( { kind: "not_found" }, null );
        return
    } );
};

User.getAll = result => {
    sql.query( "SELECT * FROM users", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        console.log( "Users: ", res );
        result( null, res );
    } );
};

User.updateById = ( id, User, result ) => {
    console.log( User.birthdate )
    sql.query(
        "UPDATE users SET name = ?, email = ?, phone_no = ?, nick_name = ?, birthdate = ?, city = ?, state = ?, \
        country = ?, website = ?, headline = ?, profile_picture = ?, yelping_since = ?, things_love = ?, \
        find_me = ? WHERE id = ?",
        [ User.name, User.email, User.phone_no, User.nick_name, User.birthdate, User.city, User.state,
        User.country, User.website, User.headline, User.profile_picture, User.yelping_since,
        User.things_love, User.find_me, id ],
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
            result( null, { id: id, ...User } );
        }
    );
};

User.updateProfile = ( id, path, result ) => {
    sql.query(
        "UPDATE users SET profile_picture = ? WHERE id = ?",
        [ path, id ],
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
            console.log( res )
            // console.log( "updated User: ", { profile_picture: profile_picture, res[0] } );
            result( null, { message: "picture added" } );
        }
    );
};

User.remove = ( email, result ) => {
    sql.query( "DELETE FROM users WHERE email = ?", email, ( err, res ) => {
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

        console.log( "deleted User with email: ", email );
        result( null, res );
    } );
};

User.removeAll = result => {
    sql.query( "DELETE FROM users", ( err, res ) => {
        if ( err ) {
            console.log( "error: ", err );
            result( null, err );
            return;
        }

        console.log( `deleted ${ res.affectedRows } Users` );
        result( null, res );
    } );
};

module.exports = User;