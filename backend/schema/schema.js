const graphql = require( 'graphql' );
const passwordHash = require( 'password-hash' );

const sql = require( "../models/db.js" );
const { ERRORS } = require( '../exceptions/errorTypes' );

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLList,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
} = graphql;

// user types
const UserType = new GraphQLObjectType( {
    name: 'User',
    fields: () => ( {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone_no: { type: GraphQLString },
        nick_name: { type: GraphQLString },
        birthdate: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        country: { type: GraphQLString },
        website: { type: GraphQLString },
        headline: { type: GraphQLString },
        profile_picture: { type: GraphQLString },
        yelping_since: { type: GraphQLString },
        things_love: { type: GraphQLString },
        find_me: { type: GraphQLString },
        password: { type: GraphQLString },
    } )
} );

// restaurant types
const RestaurantType = new GraphQLObjectType( {
    name: 'RestaurantType',
    fields: () => ( {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        zipcode: { type: GraphQLInt },
        phone_no: { type: GraphQLString },
        description: { type: GraphQLString },
        timings: { type: GraphQLString },
        pictures: { type: new GraphQLList( GraphQLString ) },
        curbside_pickup: { type: GraphQLInt },
        dine_in: { type: GraphQLInt },
        delivery: { type: GraphQLInt },
        password: { type: GraphQLString },
        latitude: { type: GraphQLFloat },
        longitude: { type: GraphQLFloat },
    } )
} );

const RestaurantAllType = new GraphQLObjectType( {
    name: 'RestaurantAllType',
    fields: () => ( {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        address: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        zipcode: { type: GraphQLInt },
        phone_no: { type: GraphQLString },
        description: { type: GraphQLString },
        timings: { type: GraphQLString },
        image: { type: GraphQLString },
        curbside_pickup: { type: GraphQLInt },
        dine_in: { type: GraphQLInt },
        delivery: { type: GraphQLInt },
        password: { type: GraphQLString },
        latitude: { type: GraphQLFloat },
        longitude: { type: GraphQLFloat },
    } )
} );

const RestaurantSearchType = new GraphQLObjectType( {
    name: "RestaurantSearchType",
    fields: () => ( {
        ids: { type: new GraphQLList( GraphQLInt ) }
    } )
} )

// review types
const ReviewType = new GraphQLObjectType( {
    name: 'Review',
    fields: () => ( {
        id: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        restaurant_id: { type: GraphQLInt },
        review_text: { type: GraphQLString },
        ratings: { type: GraphQLInt },
        date: { type: GraphQLString }
    } )
} );

const ReviewForRestaurantType = new GraphQLObjectType( {
    name: 'ReviewForRestaurantType',
    fields: () => ( {
        id: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        restaurant_id: { type: GraphQLInt },
        review_text: { type: GraphQLString },
        ratings: { type: GraphQLInt },
        date: { type: GraphQLString },
        user_name: { type: GraphQLString },
        user_city: { type: GraphQLString },
        user_state: { type: GraphQLString },
    } )
} );

const ReviewForUserType = new GraphQLObjectType( {
    name: 'ReviewForUserType',
    fields: () => ( {
        id: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        restaurant_id: { type: GraphQLInt },
        review_text: { type: GraphQLString },
        ratings: { type: GraphQLInt },
        date: { type: GraphQLString },
        restaurants_name: { type: GraphQLString },
        restaurant_address: { type: GraphQLString },
        restaurant_city: { type: GraphQLString },
        restaurant_state: { type: GraphQLString },
        restaurant_zipcode: { type: GraphQLString },
    } )
} );

const AvgRatingsType = new GraphQLObjectType( {
    name: 'AvgRatingsType',
    fields: () => ( {
        num_of_reviews: { type: GraphQLInt },
        ratings: { type: GraphQLFloat }
    } )
} );

// dish types
const DishType = new GraphQLObjectType( {
    name: 'Dish',
    fields: () => ( {
        id: { type: GraphQLInt },
        restaurant_id: { type: GraphQLInt },
        name: { type: GraphQLString },
        ingredients: { type: GraphQLString },
        price: { type: GraphQLFloat },
        description: { type: GraphQLString },
        category: { type: GraphQLString },
        cuisine: { type: GraphQLString },
        image: { type: GraphQLString },
    } )
} );

// order types
const OrderType = new GraphQLObjectType( {
    name: 'Order',
    fields: () => ( {
        id: { type: GraphQLInt },
        user_id: { type: GraphQLInt },
        restaurant_id: { type: GraphQLInt },
        dish_id: { type: GraphQLInt },
        total: { type: GraphQLFloat },
        status: { type: GraphQLString },
        delivery_option: { type: GraphQLString },
        order_date: { type: GraphQLString }
    } )
} );

const OrderForRestaurantType = new GraphQLObjectType( {
    name: 'OrderForRestaurantType',
    fields: () => ( {
        id: { type: GraphQLInt },
        order_date: { type: GraphQLString },
        total: { type: GraphQLFloat },
        status: { type: GraphQLString },
        delivery_option: { type: GraphQLString },
        user_id: { type: GraphQLInt },
        user_name: { type: GraphQLString },
        dish_name: { type: GraphQLString },
    } )
} );

const OrderForUserType = new GraphQLObjectType( {
    name: 'OrderForUserType',
    fields: () => ( {
        id: { type: GraphQLInt },
        order_date: { type: GraphQLString },
        total: { type: GraphQLFloat },
        status: { type: GraphQLString },
        delivery_option: { type: GraphQLString },
        restaurant_name: { type: GraphQLString },
        dish_name: { type: GraphQLString },
    } )
} );


const RootQuery = new GraphQLObjectType( {
    name: 'RootQueryType',
    description: 'Root Query',
    fields: {
        loginUser: {
            type: UserType,
            args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
            resolve ( _, args ) {
                console.log( "inside resolve loginuser" )
                return new Promise( ( resolve, reject ) => {
                    console.log( "inside login" )
                    sql.query( `SELECT * FROM users WHERE email = \'${ args.email }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
                        }
                        console.log( "inside sql login" )
                        if ( res.length ) {
                            console.log( "found User: ", res[ 0 ] );
                            if ( passwordHash.verify( args.password, res[ 0 ].password ) ) {
                                resolve( res[ 0 ] )
                            } else {
                                reject( new Error( ERRORS.WRONG_CREDENTIALS ) )
                            }
                        }
                        // not found User with the Email
                        reject( new Error( ERRORS.NO_USER_FOUND ) )
                    } );
                } )
            },
            reject () {
                console.log( "in reject login" )
            }
        },
        getUser: {
            type: UserType,
            args: { id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT * FROM users WHERE id = \'${ args.id }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
                        }
                        if ( res.length ) {
                            console.log( "found User: ", res[ 0 ] );
                            let { password, ...alldata } = res[ 0 ]
                            resolve( alldata )
                        }
                        // not found User with the id
                        reject( new Error( ERRORS.NO_USER_FOUND ) )
                    } );
                } )
            }
        },
        loginRestaurant: {
            type: RestaurantType,
            args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT * FROM restaurants WHERE email = \'${ args.email }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }

                        if ( res.length ) {
                            console.log( "found Restaurant: ", res[ 0 ] );
                            if ( passwordHash.verify( args.password, res[ 0 ].password ) ) {
                                resolve( res[ 0 ] );
                            } else {
                                reject( new Error( ERRORS.WRONG_CREDENTIALS ) );
                            }
                        }

                        // not found Restaurant with the Email
                        reject( new Error( ERRORS.NO_USER_FOUND ) );
                    } );
                } )
            }
        },
        getRestaurant: {
            type: RestaurantType,
            args: { id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT * FROM restaurants WHERE id = \'${ args.id }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
                        }
                        if ( res.length ) {
                            console.log( "found Restaurant: ", res[ 0 ] );
                            let { password, ...alldata } = res[ 0 ]
                            restaurant = alldata
                            sql.query( `SELECT * FROM restaurant_images WHERE restaurant_id = \'${ args.id }\'`, ( err, res ) => {
                                if ( err ) {
                                    console.log( "error: ", err );
                                    reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
                                }
                                if ( res.length ) {
                                    console.log( "found Restaurant Pictures: ", res );
                                    let images = []
                                    res.forEach( r => {
                                        let { image, ...restdata } = r
                                        images.push( image )
                                    } )
                                    restaurant[ "pictures" ] = images
                                    resolve( restaurant )
                                } else {
                                    // not found Restaurant with the id
                                    resolve( restaurant )
                                }

                            } );
                        }
                    } )
                } )
            }
        },
        getAllRestaurant: {
            type: new GraphQLList( RestaurantAllType ),
            args: {},
            resolve () {
                return new Promise( ( resolve, reject ) => {
                    sql.query( "SELECT r.id, r.name, r.address, r.city, r.state, r.zipcode, r.email, r.phone_no, r.description, r.timings, r.curbside_pickup, r.dine_in, r.delivery, r.latitude, r.longitude, ri.image FROM restaurants r LEFT JOIN restaurant_images ri on r.id = ri.restaurant_id", ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
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
                            resolve( filtered_data )
                        }
                        resolve( res )
                    } );
                } )
            }
        },
        searchRestaurant: {
            type: RestaurantSearchType,
            args: {
                category: { type: GraphQLString },
                searchTerm: { type: GraphQLString }
            },
            resolve ( _, args ) {
                if ( args.category === "cuisine" || args.category === "dish" ) {
                    if ( args.category === "dish" ) {
                        args.category = "name"
                    }
                    return new Promise( ( resolve, reject ) => {
                        sql.query( `SELECT r.id from restaurants r INNER JOIN dishes d ON d.restaurant_id=r.id where d.${ args.category } like \'%${ args.searchTerm }%\'`, ( err, res ) => {
                            if ( err ) {
                                console.log( "error: ", err );
                                reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
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
                                resolve( { ids: filtered_data } )
                            } else {
                                reject( new Error( ERRORS.NO_USER_FOUND ) );
                            }
                        } );
                    } )
                } else if ( args.category === "location" ) {
                    return new Promise( ( resolve, reject ) => {
                        sql.query( `SELECT distinct(id) from restaurants where city like \'%${ args.searchTerm }%\'`, ( err, res ) => {
                            if ( err ) {
                                console.log( "error: ", err );
                                reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
                            }
                            if ( res.length ) {
                                let filtered_data = Array.from( res, x => x.id )
                                resolve( { ids: filtered_data } )
                            } else {
                                reject( new Error( ERRORS.NO_USER_FOUND ) );
                            }
                        } );
                    } )
                }
                reject()
            }
        },
        getReviewsForUsers: {
            type: new GraphQLList( ReviewForUserType ),
            args: { id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT reviews.*, restaurants.name as restaurants_name, restaurants.address as restaurant_address, restaurants.city as restaurant_city, restaurants.state as restaurant_state, restaurants.zipcode as restaurant_zipcode FROM reviews INNER JOIN restaurants ON reviews.restaurant_id = restaurants.id WHERE reviews.user_id = \'${ args.id }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }
                        if ( res.length ) {
                            resolve( res )
                        }
                        // not found Review with the user id
                        reject( new Error( ERRORS.NO_USER_FOUND ) );
                    } );
                } )
            }
        },
        getReviewsForRestaurants: {
            type: new GraphQLList( ReviewForRestaurantType ),
            args: { id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT reviews.*, users.name as user_name, users.city as user_city, users.state as user_state FROM reviews INNER JOIN users ON reviews.user_id = users.id WHERE reviews.restaurant_id = \'${ args.id }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }
                        if ( res.length ) {
                            resolve( res )
                        }
                        // not found Review with the restaurant id
                        reject( new Error( ERRORS.NO_USER_FOUND ) );
                    } );
                } )
            }
        },
        getAvgRatings: {
            type: AvgRatingsType,
            args: { restaurant_id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `select count(*) as num_of_reviews, CAST(AVG(ratings) AS DECIMAL(10,2)) as ratings from reviews where restaurant_id= \'${ args.restaurant_id }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }
                        if ( res.length ) {
                            console.log( "ratings: " + res[ 0 ] )
                            resolve( res[ 0 ] )
                        }
                        // not found Review with the restaurant id
                        reject( new Error( ERRORS.NO_USER_FOUND ) );
                    } );
                } )
            }
        },
        getDishes: {
            type: new GraphQLList( DishType ),
            args: { restaurant_id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT * FROM dishes WHERE restaurant_id = \'${ args.restaurant_id }\'`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }

                        if ( res.length ) {
                            console.log( "found Dish: ", res );
                            resolve( res )
                        }

                        // not found Dish with the restaurant id
                        reject( new Error( ERRORS.NO_USER_FOUND ) );
                    } );
                } )
            }
        },
        getOrdersForUsers: {
            type: new GraphQLList( OrderForUserType ),
            args: { user_id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT o.id, o.total, o.status, o.order_date, delivery_option, r.name as restaurant_name, d.name as dish_name FROM orders o INNER JOIN restaurants r ON o.restaurant_id=r.id INNER JOIN dishes d on o.dish_id=d.id INNER JOIN users u on o.user_id=u.id where o.user_id=${ args.user_id } ORDER BY o.order_date DESC`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }

                        if ( res.length ) {
                            console.log( "orders: ", res );
                            resolve( res )
                        } else {
                            reject( new Error( ERRORS.NO_USER_FOUND ) );
                        }
                    } );
                } )
            }
        },
        getOrdersForRestaurants: {
            type: new GraphQLList( OrderForRestaurantType ),
            args: { restaurant_id: { type: GraphQLInt } },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( `SELECT o.id, o.total, o.status, o.order_date, o.delivery_option, u.id as user_id, u.name as user_name, d.name as dish_name FROM orders o INNER JOIN users u ON o.user_id=u.id INNER JOIN dishes d on o.dish_id=d.id INNER JOIN restaurants r on o.restaurant_id=r.id where o.restaurant_id=${ args.restaurant_id } ORDER BY o.order_date DESC`, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }

                        if ( res.length ) {
                            console.log( "orders: ", res );
                            resolve( res )
                        } else {
                            reject( new Error( ERRORS.NO_USER_FOUND ) );
                        }
                    } );
                } )
            }
        }
    }
} );

const Mutation = new GraphQLObjectType( {
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve ( _, args ) {
                args.password = passwordHash.generate( args.password );
                return new Promise( ( resolve, reject ) => {
                    sql.query( "INSERT INTO users SET ?", args, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            if ( err.code === 'ER_DUP_ENTRY' ) {
                                reject( new Error( ERRORS.USER_EXIST ) )
                            }
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) )
                        }
                        if ( res ) {
                            resolve( { id: res.insertId } )
                        }
                    } );
                } )
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone_no: { type: GraphQLString },
                nick_name: { type: GraphQLString },
                birthdate: { type: GraphQLString },
                city: { type: GraphQLString },
                state: { type: GraphQLString },
                country: { type: GraphQLString },
                website: { type: GraphQLString },
                headline: { type: GraphQLString },
                profile_picture: { type: GraphQLString },
                yelping_since: { type: GraphQLString },
                things_love: { type: GraphQLString },
                find_me: { type: GraphQLString },
            },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query(
                        "UPDATE users SET name = ?, email = ?, phone_no = ?, nick_name = ?, birthdate = ?, city = ?, state = ?, \
                        country = ?, website = ?, headline = ?, profile_picture = ?, yelping_since = ?, things_love = ?, \
                        find_me = ? WHERE id = ?",
                        [ args.name, args.email, args.phone_no, args.nick_name, args.birthdate, args.city, args.state,
                        args.country, args.website, args.headline, args.profile_picture, args.yelping_since,
                        args.things_love, args.find_me, args.id ],
                        ( err, res ) => {
                            if ( err ) {
                                console.log( "error: ", err );
                                reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                            }
                            console.log( res )
                            if ( res.affectedRows == 0 ) {
                                // not found User with the id
                                reject( new Error( ERRORS.NO_USER_FOUND ) );
                            }
                            resolve( args );
                        }
                    );
                } )
            }
        },
        createRestaurant: {
            type: RestaurantType,
            args: {
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                address: { type: GraphQLString },
                city: { type: GraphQLString },
                state: { type: GraphQLString },
                zipcode: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            resolve ( _, args ) {
                args.password = passwordHash.generate( args.password );
                return new Promise( ( resolve, reject ) => {
                    sql.query( "INSERT INTO restaurants SET ?", args, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            if ( err.code === 'ER_DUP_ENTRY' ) {
                                reject( new Error( ERRORS.USER_EXIST ) )
                            }
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }
                        if ( res ) {
                            resolve( { id: res.insertId } )
                        }
                    } );
                } )
            }
        },
        updateRestaurant: {
            type: RestaurantType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                address: { type: GraphQLString },
                city: { type: GraphQLString },
                state: { type: GraphQLString },
                zipcode: { type: GraphQLInt },
                phone_no: { type: GraphQLString },
                description: { type: GraphQLString },
                timings: { type: GraphQLString },
                curbside_pickup: { type: GraphQLInt },
                dine_in: { type: GraphQLInt },
                delivery: { type: GraphQLInt },
                latitude: { type: GraphQLFloat },
                longitude: { type: GraphQLFloat },
            },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    let curbside_pickup = args.curbside_pickup ? 1 : 0
                    let dine_in = args.dine_in ? 1 : 0
                    let delivery = args.delivery ? 1 : 0
                    sql.query(
                        "UPDATE restaurants SET name = ?, email = ?, address = ?, city = ?, state = ?, zipcode = ?, phone_no = ?, description = ?, timings = ?, curbside_pickup = ?, dine_in = ?, delivery = ?, latitude = ?, longitude = ? WHERE id = ?",
                        [ args.name, args.email, args.address, args.city, args.state, args.zipcode, args.phone_no, args.description, args.timings, curbside_pickup, dine_in, delivery, args.latitude, args.longitude, args.id ],
                        ( err, res ) => {
                            if ( err ) {
                                console.log( "error: ", err );
                                reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                            }

                            if ( res.affectedRows == 0 ) {
                                reject( new Error( ERRORS.NO_USER_FOUND ) );
                            }
                            resolve( args )
                        }
                    );
                } )
            }
        },
        createReview: {
            type: ReviewType,
            args: {
                user_id: { type: GraphQLInt },
                restaurant_id: { type: GraphQLInt },
                review_text: { type: GraphQLString },
                ratings: { type: GraphQLInt },
            },
            resolve ( _, args ) {
                args.date = new Date();
                return new Promise( ( resolve, reject ) => {
                    sql.query( "INSERT INTO reviews SET ?", args, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }
                        if ( res ) {
                            resolve( { id: res.insertId } )
                        }
                    } );
                } )
            }
        },
        createDish: {
            type: DishType,
            args: {
                restaurant_id: { type: GraphQLInt },
                name: { type: GraphQLString },
                ingredients: { type: GraphQLString },
                price: { type: GraphQLFloat },
                description: { type: GraphQLString },
                category: { type: GraphQLString },
                cuisine: { type: GraphQLString },
            },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( "INSERT INTO dishes SET ?", args, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }
                        if ( res ) {
                            resolve( { id: res.insertId } )
                        }
                    } );
                } )
            }
        },
        updateDish: {
            type: DishType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                ingredients: { type: GraphQLString },
                price: { type: GraphQLFloat },
                description: { type: GraphQLString },
                category: { type: GraphQLString },
                cuisine: { type: GraphQLString },
            },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query(
                        "UPDATE dishes SET name = ?, ingredients = ?, price = ?, description = ?, category = ?, cuisine = ? WHERE id = ?",
                        [ args.name, args.ingredients, args.price, args.description, args.category, args.cuisine, args.id ],
                        ( err, res ) => {
                            if ( err ) {
                                console.log( "error: ", err );
                                reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                            }

                            if ( res.affectedRows == 0 ) {
                                // not found Dish with the id
                                reject( new Error( ERRORS.NO_USER_FOUND ) );
                            }
                            resolve( args )
                        }
                    );
                } )
            }
        },
        createOrder: {
            type: OrderType,
            args: {
                user_id: { type: GraphQLInt },
                restaurant_id: { type: GraphQLInt },
                dish_id: { type: GraphQLInt },
                total: { type: GraphQLFloat },
                status: { type: GraphQLString },
                delivery_option: { type: GraphQLString },
            },
            resolve ( _, args ) {
                args.order_date = new Date();
                return new Promise( ( resolve, reject ) => {
                    sql.query( "INSERT INTO orders SET ?", args, ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }
                        if ( res ) {
                            resolve( { id: res.insertId } )
                        }
                    } )
                } )
            }
        },
        updateOrder: {
            type: OrderType,
            args: {
                id: { type: GraphQLInt },
                updated_status: { type: GraphQLString },
            },
            resolve ( _, args ) {
                return new Promise( ( resolve, reject ) => {
                    sql.query( "UPDATE orders SET status = ? WHERE id = ?", [ args.updated_status, args.id ], ( err, res ) => {
                        if ( err ) {
                            console.log( "error: ", err );
                            reject( new Error( ERRORS.INTERNAL_SERVER_EROR ) );
                        }

                        if ( res.affectedRows == 0 ) {
                            // not found User with the email
                            reject( new Error( ERRORS.NO_USER_FOUND ) );
                        }
                        resolve( args )
                    }
                    );
                } )
            }
        }
    }
} );

const schema = new GraphQLSchema( {
    query: RootQuery,
    mutation: Mutation
} );

module.exports = schema;