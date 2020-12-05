import React, { Component } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup';
import { Redirect } from 'react-router';

import './RestaurantPage.css'
import Reviews from '../Reviews/Reviews'
import Dishes from '../Dish/Dishes'
import CreateReview from '../Reviews/CreateReview'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class RestaurantPage extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: "",
            name: "",
            email: "",
            phone_no: "",
            address: "",
            city: "",
            state: "",
            zipcode: "",
            description: "",
            timings: "",
            pictures: [],
            curbside_pickup: false,
            delivery: false,
            dine_in: false,
            avgRatings: "",
            num_of_reviews: "",
            deliveryOption: "",
            error: ""
        }
    }

    componentDidMount () {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id && this.props.location.state.id ) {
            axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/getrestaurant/" + this.props.location.state.id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            name: res.data.name,
                            email: res.data.email,
                            phone_no: res.data.phone_no,
                            address: res.data.address,
                            city: res.data.city,
                            state: res.data.state,
                            zipcode: res.data.zipcode,
                            description: res.data.description,
                            curbside_pickup: res.data.curbside_pickup === 1 ? true : false,
                            delivery: res.data.delivery === 1 ? true : false,
                            dine_in: res.data.dine_in === 1 ? true : false,
                            timings: res.data.timings,
                            pictures: res.data.pictures
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( err.response.message )
                        } else if ( err.response.status === 400 ) {
                            console.log( err.response.message )
                        }
                    }
                } )
            axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/averageRatingsForRestaurant/" + this.props.location.state.id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            avgRatings: res.data.ratings,
                            num_of_reviews: res.data.num_of_reviews
                        } )
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( err.response.message )
                        } else if ( err.response.status === 400 ) {
                            console.log( err.response.message )
                        }
                    }
                } )
        } else {
            console.log( "No Id found in local storage" )
        }
    }

    onOrder = ( dishId, dishPrice ) => {
        if ( this.state.deliveryOption ) {
            this.setState( {
                error: ""
            } )
            const orderData = {
                restaurant_id: this.props.location.state.id,
                user_id: localStorage.getItem( "id" ),
                dish_id: dishId,
                total: dishPrice,
                delivery_option: this.state.deliveryOption
            }
            axios.defaults.withCredentials = true;
            axios.post( BACKEND_URL + ":" + BACKEND_PORT + "/createOrder", orderData )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            error: ""
                        } )
                        var toast = document.getElementById( "toast" )
                        toast.classList.add( "show" )
                        setTimeout( () => {
                            toast.classList.remove( "show" )
                        }, 3000 );
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        console.log( err.response )
                        return
                    }
                    return
                } )
        } else {
            this.setState( {
                error: "Please select delivery option"
            } )
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    render () {
        var redirectVar = null
        if ( !this.props.location.state ) {
            redirectVar = <Redirect to="/login" />
            return redirectVar
        }
        const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
        const arrowStyle = { color: '#000' }; // style for an svg element
        const contentStyle = { background: '#fff' };

        const Modal = () => (
            <Popup
                trigger={ <button type="button" className="btn red-button" >
                    <svg viewBox="1 1 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.5 12.04l-4.326 2.275L4 9.497.5 6.086l4.837-.703L7.5 1l2.163 4.383 4.837.703L11 9.497l.826 4.818L7.5 12.041z" stroke="currentColor" fill="#ffffff" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    &nbsp;<strong>Write a Review</strong></ button> }
                { ...{ contentStyle, overlayStyle, arrowStyle } }
                position="right top">
                <CreateReview restaurant_id={ this.props.location.state.id } />
            </Popup>
        );

        let ratings = () => {
            ratings = parseInt( this.state.avgRatings )
            var out = []
            if ( !this.state.avgRatings ) {
                for ( let i = 0; i < 5; i++ ) {
                    out.push( <span className="fa fa-star"></span> )
                }
                return out
            }
            for ( let i = 0; i < ratings; i++ ) {
                out.push( <span className="fa fa-star checked"></span> )
            }
            for ( let i = ratings + 1; i < 6; i++ ) {
                out.push( <span className="fa fa-star"></span> )
            }
            return out
        }

        let options = [ <option name="deliveryByName" value="">Select Delivery</option> ]
        if ( this.state.curbside_pickup ) {
            options.push( <option name="deliveryByName" value="pickup">Pickup</option> )
        }
        if ( this.state.delivery ) {
            options.push( <option name="deliveryByName" value="delivery">Delivery</option> )
        }

        return (
            <div >
                {redirectVar }
                <div>
                    <div className="row picture-scrolling-wrapper">
                        <div className="picture-scrolling">
                            { this.state.pictures && this.state.pictures.map( picture => {
                                return <img src={ BACKEND_URL + ":" + BACKEND_PORT + "/" + picture } key={ picture } alt="restaurant_picture" className="restaurant-picture" crossOrigin="anonymous"></img>
                            } ) }
                        </div>
                    </div>
                    <div className="restaurantpage-information">
                        <div className="row">
                            <div className="col-10">
                                <div className="row restaurant-info-wrapper">
                                    <div className="col-9">
                                        <div className="row">
                                            <h1 className="restaurantpage-name">{ this.state.name }</h1>
                                        </div>
                                        <div className="row">
                                            <div className="restaurant-ratings">{ ratings() }</div>
                                            <div className="num-of-reviews">&nbsp; { this.state.num_of_reviews } Reviews</div>
                                        </div>
                                        <div className="row restaurant-timings">
                                            { this.state.timings }
                                        </div>
                                        <div className="row writereview-wrapper">
                                            <Modal />
                                        </div>
                                    </div>
                                    <div className="col-3">
                                        <div className="contact-info-wrapper">
                                            <div className="contact-info">
                                                <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M14.5.5l-6 6m6-6V4m0-3.5H11M2.5.5h2.22a1 1 0 01.97.757l.585 2.345a1 1 0 01-.654 1.19l-1.108.37a1.21 1.21 0 00-.804 1.385 6.047 6.047 0 004.744 4.744 1.21 1.21 0 001.385-.804l.297-.893a1 1 0 011.396-.578l2.416 1.208a1 1 0 01.553.894V12.5a2 2 0 01-2 2h-2c-5.523 0-10-4.477-10-10v-2a2 2 0 012-2z" stroke="currentColor"></path></svg>
                                        &nbsp;&nbsp;&nbsp;{ this.state.phone_no }
                                            </div>
                                            <div className="contact-info">
                                                <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.713 11.493l-.035-.5.035.5zM1.5 1h12V0h-12v1zm12.5.5v12h1v-12h-1zM13.5 14h-12v1h12v-1zM1 13.5v-12H0v12h1zm.5.5a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 15v-1zm12.5-.5a.5.5 0 01-.5.5v1a1.5 1.5 0 001.5-1.5h-1zM13.5 1a.5.5 0 01.5.5h1A1.5 1.5 0 0013.5 0v1zm-12-1A1.5 1.5 0 000 1.5h1a.5.5 0 01.5-.5V0zm6 12c.083 0 .166-.003.248-.009l-.07-.997A2.546 2.546 0 017.5 11v1zm-.823-.098c.264.064.54.098.823.098v-1c-.203 0-.4-.024-.589-.07l-.234.973zm.234-.972c-.969-.233-1.9-.895-2.97-1.586C2.924 8.687 1.771 8 .5 8v1c.938 0 1.858.512 2.899 1.184.987.638 2.099 1.434 3.278 1.719l.234-.973zm.837 1.061c1.386-.097 2.7-.927 3.865-1.632C12.843 9.616 13.922 9 15 9V8c-1.407 0-2.732.794-3.905 1.503-1.237.749-2.324 1.414-3.417 1.49l.07.998z" fill="currentColor"></path></svg>
                                        &nbsp;&nbsp;&nbsp;{ this.state.email }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="row menu-title">
                                    <div className="row">
                                        <h4>Populer Dishes</h4>
                                    </div>
                                    <form>
                                        <div className="form-row form-group delivery-selection">
                                            <select name="deliveryOption" id="deliveryOptions" className="form-control deliveryOptions" onChange={ this.onChange }>
                                                { options }
                                            </select>
                                        </div>
                                        <span className="select-delivery">{ this.state.error }</span>
                                    </form>
                                    <Dishes id={ this.props.location.state.id } radioShow={ false } orderButton={ this.state.curbside_pickup || this.state.delivery } onOrder={ this.onOrder }></Dishes>
                                </div>
                            </div>
                            <div className="col-2">
                                <Reviews id={ this.props.location.state.id } active="restaurant" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="toast" id="toast">
                    Ordered
                </div>
            </div>
        )
    }
}
