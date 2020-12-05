import React, { Component } from 'react'
import axios from 'axios'
import Popup from 'reactjs-popup';
import { Redirect } from 'react-router';

import UpdateRestaurant from './UpdateRestaurant'
import Dishes from '../Dish/Dishes'
import AddDish from '../Dish/AddDish'
import './RestaurantProfile.css'
import Reviews from '../Reviews/Reviews'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class RestaurantProfile extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            name: "",
            email: "",
            phone_no: "",
            location: "",
            description: "",
            timings: "",
            pictures: [],
            curbside_pickup: false,
            dine_in: false,
            delivery: false,
            selected: "",
            avgRatings: 0,
            num_of_reviews: "",
            radioShow: false,
            showPopup: false
        }
    }

    componentDidMount () {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id ) {
            axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/getrestaurant/" + id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        console.log( res.data )
                        this.setState( {
                            name: res.data.name,
                            email: res.data.email,
                            phone_no: res.data.phone_no,
                            address: res.data.address,
                            city: res.data.city,
                            state: res.data.state,
                            zipcode: res.data.zipcode,
                            latitude: res.data.latitude,
                            longitude: res.data.longitude,
                            description: res.data.description,
                            timings: res.data.timings,
                            curbside_pickup: res.data.curbside_pickup,
                            dine_in: res.data.dine_in,
                            delivery: res.data.delivery,
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
            axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/averageRatingsForRestaurant/" + id )
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

    onChangePictures = item => {
        console.log( item.target.files )
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        console.log( item.target.files )
        if ( id ) {
            const formData = new FormData()
            Array.from( item.target.files ).forEach( ( file ) => {
                formData.append( 'file', file )
            } )
            formData.append( 'id', id )
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post( BACKEND_URL + ":" + BACKEND_PORT + "/restaurantPictures", formData, config )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        window.location.reload();
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

    addFiles = () => {
        document.getElementById( "restaurantPictures" ).click()
    }

    updateProfile = () => {
        this.setState( {
            showPopup: !this.state.showPopup
        } )
    }

    updateDish = () => {
        this.setState( {
            radioShow: !this.state.radioShow
        } )
    }

    render () {
        var redirectVar = null
        if ( localStorage.getItem( "active" ) !== "restaurant" ) {
            redirectVar = <Redirect to="/login" />
            return redirectVar
        }
        if ( localStorage.getItem( "email" ) ) {
            // const contentStyle = { background: '#000' };
            const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
            const arrowStyle = { color: '#000' }; // style for an svg element

            const Modal = () => (
                <Popup
                    trigger={ <button type="button" className="btn btn-secondary"> Update</button> }
                    { ...{ overlayStyle, arrowStyle } }
                    position="left top">
                    <UpdateRestaurant restaurant={ this.state } />
                </Popup>
            );

            const AddNewDish = () => (
                <Popup
                    trigger={ <button type="button" className="btn red-button">Add Dish</button> }
                    { ...{ overlayStyle, arrowStyle } }
                    position="top">
                    <AddDish />
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

            return (
                <div >
                    {redirectVar }
                    < div id="restaurantProfile" style={ this.style }>
                        <div className="row h-25">
                            <div className="col-7">
                                <div className="row restaurantname">
                                    {/* <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M11.5 6.5v5a3 3 0 01-3 3h-5a3 3 0 01-3-3v-5a1 1 0 011-1h9a1 1 0 011 1zm0 0h2a1 1 0 011 1v2a1 1 0 01-1 1h-2M4.5 4V2m3 2V0" stroke="currentColor"></path></svg> */ }
                                    <h1 className="restaurantpage-name">{ this.state.name }</h1>
                                </div>
                                <div className="restaurant-ratings">{ ratings() }&nbsp; { this.state.num_of_reviews } Reviews</div>
                                <div>
                                    { this.state.address }, { this.state.city }, { this.state.state }, { this.state.zipcode }
                                </div>
                                <div className="row restaurantdescription">
                                    {/* { this.state.description } */ }
                                </div>
                            </div>
                            <div className="col-4">
                                <div>
                                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.713 11.493l-.035-.5.035.5zM1.5 1h12V0h-12v1zm12.5.5v12h1v-12h-1zM13.5 14h-12v1h12v-1zM1 13.5v-12H0v12h1zm.5.5a.5.5 0 01-.5-.5H0A1.5 1.5 0 001.5 15v-1zm12.5-.5a.5.5 0 01-.5.5v1a1.5 1.5 0 001.5-1.5h-1zM13.5 1a.5.5 0 01.5.5h1A1.5 1.5 0 0013.5 0v1zm-12-1A1.5 1.5 0 000 1.5h1a.5.5 0 01.5-.5V0zm6 12c.083 0 .166-.003.248-.009l-.07-.997A2.546 2.546 0 017.5 11v1zm-.823-.098c.264.064.54.098.823.098v-1c-.203 0-.4-.024-.589-.07l-.234.973zm.234-.972c-.969-.233-1.9-.895-2.97-1.586C2.924 8.687 1.771 8 .5 8v1c.938 0 1.858.512 2.899 1.184.987.638 2.099 1.434 3.278 1.719l.234-.973zm.837 1.061c1.386-.097 2.7-.927 3.865-1.632C12.843 9.616 13.922 9 15 9V8c-1.407 0-2.732.794-3.905 1.503-1.237.749-2.324 1.414-3.417 1.49l.07.998z" fill="currentColor"></path></svg>
                                &nbsp;&nbsp;&nbsp;{ this.state.email }
                                </div>
                                <div>
                                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M14.5.5l-6 6m6-6V4m0-3.5H11M2.5.5h2.22a1 1 0 01.97.757l.585 2.345a1 1 0 01-.654 1.19l-1.108.37a1.21 1.21 0 00-.804 1.385 6.047 6.047 0 004.744 4.744 1.21 1.21 0 001.385-.804l.297-.893a1 1 0 011.396-.578l2.416 1.208a1 1 0 01.553.894V12.5a2 2 0 01-2 2h-2c-5.523 0-10-4.477-10-10v-2a2 2 0 012-2z" stroke="currentColor"></path></svg>
                                &nbsp;&nbsp;&nbsp;{ this.state.phone_no }
                                </div>
                                <div>
                                    <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M7.5 7.5H7a.5.5 0 00.146.354L7.5 7.5zm0 6.5A6.5 6.5 0 011 7.5H0A7.5 7.5 0 007.5 15v-1zM14 7.5A6.5 6.5 0 017.5 14v1A7.5 7.5 0 0015 7.5h-1zM7.5 1A6.5 6.5 0 0114 7.5h1A7.5 7.5 0 007.5 0v1zm0-1A7.5 7.5 0 000 7.5h1A6.5 6.5 0 017.5 1V0zM7 3v4.5h1V3H7zm.146 4.854l3 3 .708-.708-3-3-.708.708z" fill="currentColor"></path></svg>
                                &nbsp;&nbsp;&nbsp;{ this.state.timings }
                                </div>
                            </div>
                            <div className="col-1">
                                <Modal />
                            </div>
                        </div>
                        <div className="row h-45">
                            {/* <h2>Pictures</h2> */ }
                            <div className="col">
                                <div className="row">
                                    <div className="text-center">
                                        <input type="file" id="restaurantPictures" name="restaurantpictures" title="" accept="image/*" onChange={ this.onChangePictures } multiple hidden />
                                        <button type="button" className="btn red-button" onClick={ this.addFiles }>Add Picture</button>
                                    </div>
                                </div>
                                <div className="row picture-scrolling-wrapper">
                                    <div className="picture-scrolling">
                                        { this.state.pictures && this.state.pictures.map( picture => {
                                            return <img src={ BACKEND_URL + ":" + BACKEND_PORT + "/" + picture } key={ picture } alt="restaurant_picture" className="restaurant-picture shadow" crossOrigin="anonymous"></img>
                                        } ) }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row h-70">
                            <div className="col-10">
                                <div className="row dish-heading">
                                    <div className="menu-title text-center">
                                        <h2><span className="h2-dish-heading">Dishes</span></h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4"></div>
                                    <div className="col-4"></div>
                                    <div className="col-2 text-center">
                                        <AddNewDish />
                                    </div>
                                    <div className="col-2">
                                        <button type="button" className="btn red-button" onClick={ this.updateDish }>Update Dish</button>
                                    </div>
                                    {/* <div className="col-4"></div> */ }
                                </div>
                                {/* <div className="row dishes"> */ }
                                <Dishes id={ localStorage.getItem( "id" ) } radioShow={ this.state.radioShow } orderButton={ false }></Dishes>
                                {/* </div> */ }
                            </div>
                            <div className="col-2">
                                <div className="row">
                                    <Reviews id={ localStorage.getItem( "id" ) } active={ localStorage.getItem( "active" ) } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            window.location.assign( '/login' )
            return null
        }

    }
    style = {
        height: "100vh",
        margin: "30px 20px 20px 20px"
    }
}
