import { gql } from 'apollo-boost';

// login queries
const UserLoginQuery = gql`
    query UserLoginQuery($email: String, $password: String){
        loginUser(email: $email, password: $password) {
            id,
            email
        }
    }
`;

const RestaurantLoginQuery = gql`
    query RestaurantLoginQuery($email: String, $password: String){
        loginRestaurant(email: $email, password: $password) {
            id,
            email
        }
    }
`;

// user queries
const GetUserQuery = gql`
    query GetUserQuery($id: Int){
        getUser(id: $id){
            id,
            name,
            email,
            phone_no,
            nick_name,
            birthdate,
            city,
            state,
            country,
            website,
            headline,
            profile_picture,
            yelping_since,
            things_love,
            find_me,
        }
    }
`;

// restaurant queries
const GetRestaurant = gql`
    query GetRestaurant($id: Int) {
        getRestaurant(id: $id){
            id,
            name,
            email,
            address,
            city,
            state,
            zipcode,
            phone_no,
            description,
            timings,
            pictures,
            curbside_pickup,
            dine_in,
            delivery
        }
    }
`;

const GetAllRestaurantQuery = gql`
    query {
        getAllRestaurant {
            id,
            name,
            email,
            address,
            city,
            state,
            zipcode,
            phone_no,
            description,
            timings,
            image,
            curbside_pickup,
            dine_in,
            delivery,
            password,
            latitude,
            longitude,
        }
    }
`;

const SearchRestaurantQuery = gql`
    query SearchRestaurantQuery($category: String, $searchTerm: String)  {
        searchRestaurant(category: $category, searchTerm: $searchTerm) {
            ids
        }
    }
`;

// reviews queries
const GetReviewsForUser = gql`
    query GetReviewsForUser($id: Int){
        getReviewsForUsers(id: $id){
            id,
            user_id,
            restaurant_id,
            review_text,
            ratings,
            date,
            restaurants_name,
            restaurant_address,
            restaurant_city,
            restaurant_state,
            restaurant_zipcode
        }
    }
`;

const GetReviewsForRestaurant = gql`
    query GetReviewsForRestaurant($id: Int){
        getReviewsForRestaurants(id: $id){
            id,
            user_id,
            restaurant_id,
            review_text,
            ratings,
            date,
            user_name,
            user_city,
            user_state
        }
    }
`;

const GetAvgRatingsQuery = gql`
    query GetAvgRatingsQuery($restaurant_id: Int){
        getAvgRatings(restaurant_id: $restaurant_id){
            num_of_reviews,
            ratings
        }
    }
`;

// dishes queries
const GetDishes = gql`
    query GetDishes($restaurant_id: Int){
        getDishes(restaurant_id: $restaurant_id){
            id,
            restaurant_id,
            name,
            ingredients,
            price,
            description,
            category,
            cuisine,
            image,
        }
    }
`;

// order queries
const GetOrdersForUserQuery = gql`
    query GetOrdersForUserQuery($user_id: Int){
        getOrdersForUsers(user_id: $user_id){
            id,
            order_date,
            total,
            status,
            delivery_option,
            restaurant_name,
            dish_name,
        }
    }
`;

const GetOrdersForRestaurantQuery = gql`
    query GetOrdersForRestaurantQuery($restaurant_id: Int){
        getOrdersForRestaurants(restaurant_id: $restaurant_id){
            id,
            order_date,
            total,
            status,
            delivery_option,
            user_id,
            user_name,
            dish_name,
        }
    }
`;

export {
    UserLoginQuery,
    RestaurantLoginQuery,
    GetUserQuery,
    GetRestaurant,
    GetAllRestaurantQuery,
    SearchRestaurantQuery,
    GetReviewsForUser,
    GetReviewsForRestaurant,
    GetAvgRatingsQuery,
    GetDishes,
    GetOrdersForUserQuery,
    GetOrdersForRestaurantQuery
}