import { gql } from 'apollo-boost';

// user mutations
const AddUserMutation = gql`
    mutation(
        $name: String,
        $email: String,
        $password: String
    ){
        createUser(
            name: $name,
            email: $email,
            password: $password
        ){
            id
        }
    }
`;

const UpdateUserMutation = gql`
    mutation UpdateUserMutation(
        $id: Int,
        $name: String,
        $email: String,
        $phone_no: String,
        $nick_name: String,
        $birthdate: String,
        $city: String,
        $state: String,
        $country: String,
        $website: String,
        $headline: String,
        $profile_picture: String,
        $yelping_since: String,
        $things_love: String,
        $find_me: String,
    ){
        updateUser(
            id: $id,
            name: $name,
            email: $email,
            phone_no: $phone_no,
            nick_name: $nick_name,
            birthdate: $birthdate,
            city: $city,
            state: $state,
            country: $country,
            website: $website,
            headline: $headline,
            profile_picture: $profile_picture,
            yelping_since: $yelping_since,
            things_love: $things_love,
            find_me: $find_me
        ){
            id
        }
    }
`;

// restaurant mutations
const AddRestaurantMutation = gql`
    mutation(
        $name: String,
        $email: String,
        $address: String
        $password: String,
        $city: String,
        $state: String,
        $zipcode: String
    ){
        createRestaurant(
            name: $name,
            email: $email,
            password: $password,
            address: $address,
            city: $city,
            state: $state,
            zipcode: $zipcode
        ){
            id
        }
    }
`;

const UpdateRestaurantMutation = gql`
    mutation UpdateRestaurantMutation(
        $id: Int,
        $name: String,
        $email: String,
        $address: String,
        $city: String,
        $state: String,
        $zipcode: Int,
        $phone_no: String,
        $description: String,
        $timings: String,
        $curbside_pickup: Int,
        $dine_in: Int,
        $delivery: Int,
        $latitude: Float,
        $longitude: Float
    ) {
        updateRestaurant(
            id: $id,
            name: $name,
            email: $email,
            address: $address,
            city: $city,
            state: $state,
            zipcode: $zipcode,
            phone_no: $phone_no,
            description: $description,
            timings: $timings,
            curbside_pickup: $curbside_pickup,
            dine_in: $dine_in,
            delivery: $delivery,
            latitude: $latitude,
            longitude: $longitude
        ){
            id 
        }
        }
`;

// dish mutations
const AddDishMutation = gql`
    mutation AddDishMutation(
        $restaurant_id: Int,
        $name: String,
        $ingredients: String,
        $price: Float,
        $description: String,
        $category: String,
        $cuisine: String,
    ){
        createDish(
            restaurant_id: $restaurant_id,
            name: $name,
            ingredients: $ingredients,
            price: $price,
            description: $description,
            category: $category,
            cuisine: $cuisine,
        ){
            id
       }
    }
`;

const UpdateDishMutation = gql`
    mutation UpdateDishMutation(
        $id: Int,
        $name: String,
        $ingredients: String,
        $price: Float,
        $description: String,
        $category: String,
        $cuisine: String,
    ){
        updateDish(
            id: $id,
            name: $name,
            ingredients: $ingredients,
            price: $price,
            description: $description,
            category: $category,
            cuisine: $cuisine,
        ){
            id
        }
    }
`;

// order mutations
const CreateOrderMutation = gql`
    mutation CreateOrderMutation(
        $user_id: Int,
        $restaurant_id: Int,
        $dish_id: Int,
        $total: Float,
        $status: String,
        $delivery_option: String
    ){
        createOrder(
            user_id: $user_id,
            restaurant_id: $restaurant_id,
            dish_id: $dish_id,
            total: $total,
            status: $status,
            delivery_option: $delivery_option
        ){
            id
        }
    }
`;

const UpdateOrderStatusMutation = gql`
    mutation UpdateOrderStatusMutation($id: Int, $updated_status: String) {
        updateOrder(id: $id, updated_status: $updated_status){
            id
        }
    }
`;

// review mutations
const CreateReviewMutation = gql`
    mutation CreateReviewMutation(
        $user_id: Int,
        $restaurant_id: Int,
        $review_text: String,
        $ratings: Int,
    ){
        createReview(
            user_id: $user_id,
            restaurant_id: $restaurant_id,
            review_text: $review_text,
            ratings: $ratings,
        ){
            id
        }
    }
`;

export {
    AddUserMutation,
    UpdateUserMutation,
    AddRestaurantMutation,
    UpdateRestaurantMutation,
    AddDishMutation,
    UpdateDishMutation,
    CreateOrderMutation,
    UpdateOrderStatusMutation,
    CreateReviewMutation
}