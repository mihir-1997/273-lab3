import React, { Component } from 'react'
import './Userprofile.css'
import axios from 'axios'
import Popup from 'reactjs-popup';
import { Redirect } from 'react-router';

import UpdateProfile from './UpdateUserProfile'
import Reviews from '../Reviews/Reviews'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'
const FormData = require( 'form-data' );

export class UserProfile extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: "",
            name: "",
            email: "",
            phone_no: "",
            nick_name: "",
            birthdate: "",
            city: "",
            state: "",
            country: "",
            website: "",
            headline: "",
            profile_picture: "",
            yelping_since: "",
            things_love: "",
            find_me: "",
            num_of_reviews: "",
            showPopup: false
        }
    }

    componentDidMount () {
        let id = null
        if ( this.props.location.state ) {
            id = this.props.location.state.user_id
        } else {
            id = localStorage.getItem( "id" )
        }
        axios.defaults.withCredentials = true;
        if ( id ) {
            axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/getuser/" + id )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        this.setState( {
                            id: res.data.id,
                            name: res.data.name,
                            email: res.data.email,
                            phone_no: res.data.phone_no,
                            nick_name: res.data.nick_name,
                            birthdate: res.data.birthdate,
                            city: res.data.city,
                            state: res.data.state,
                            country: res.data.country,
                            website: res.data.website,
                            headline: res.data.headline,
                            profile_picture: res.data.profile_picture,
                            yelping_since: res.data.yelping_since,
                            things_love: res.data.things_love,
                            find_me: res.data.find_me,
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

    onChangeProfile = item => {
        axios.defaults.withCredentials = true;
        let id = localStorage.getItem( "id" )
        if ( id ) {
            const formData = new FormData()
            formData.append( 'file', item.target.files[ 0 ] )
            formData.append( 'id', id )
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.post( BACKEND_URL + ":" + BACKEND_PORT + "/updateProfile", formData, config )
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

    updateProfile = () => {
        this.setState( {
            showPopup: !this.state.showPopup
        } )
    }

    num_of_reviews = ( data ) => {
        this.setState( {
            num_of_reviews: data
        } )
    }

    render () {
        var redirectVar = null
        if ( localStorage.getItem( "active" ) !== "user" && !this.props.location.state ) {
            redirectVar = <Redirect to="/login" />
            return redirectVar
        }
        if ( localStorage.getItem( "email" ) || this.props.location.state ) {
            const contentStyle = { background: '#000' };
            const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
            const arrowStyle = { color: '#000' }; // style for an svg element

            const Modal = () => (
                <Popup
                    trigger={ <button type="button" className="btn btn-secondary"> Update</button> }
                    { ...{ contentStyle, overlayStyle, arrowStyle } }
                    position="left top">
                    <UpdateProfile user={ this.state } />
                </Popup>
            );

            let reviews = null
            if ( this.props.location.state ) {
                reviews = <Reviews id={ this.props.location.state.user_id } num_of_reviews={ this.num_of_reviews } active="user" />
            } else {
                reviews = <Reviews id={ localStorage.getItem( "id" ) } num_of_reviews={ this.num_of_reviews } active="user" />
            }

            return (
                <div >
                    {redirectVar }
                    <div id="userProfile" className="container userprofile-wrapper" style={ this.style }>
                        <div className="row userprofile-firstrow">
                            <div className="col-3 profile-picture-wrapper">
                                <div className="profile-picture">
                                    <img src={ BACKEND_URL + ":" + BACKEND_PORT + "/" + this.state.profile_picture } alt="profile" className="profile_pic" crossOrigin="anonymous"></img>
                                </div>
                                <form>
                                    { !this.props.location.state ? <input type="file" id="profile" className="profile-picture-image" name="profile_picture" accept="image/*" onChange={ this.onChangeProfile } /> : null }
                                </form>
                            </div>
                            <div className="col-7">
                                <div className="user-information">
                                    <span className="username">{ this.state.name }</span>
                                    <br />
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="2 2 24 24" width="18" height="18" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                        &nbsp;&nbsp;<span className="userlocation">{ this.state.city }, { this.state.state }</span>
                                    <br />
                                    <span className="usersince">Since { this.state.yelping_since }</span>
                                    <br />
                                    <div className="userprofile-numofreviews">
                                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M7.948.779a.5.5 0 00-.896 0L5.005 4.926l-4.577.665a.5.5 0 00-.277.853l3.312 3.228-.782 4.559a.5.5 0 00.725.527L7.5 12.605l4.094 2.153a.5.5 0 00.725-.527l-.782-4.56 3.312-3.227a.5.5 0 00-.277-.853l-4.577-.665L7.948.78z" fill="orange"></path></svg>
                                &nbsp;<strong>{ this.state.num_of_reviews }</strong> Reviews
                                </div>
                                    <span className="userdescription">
                                        "{ this.state.headline }"
                                </span>
                                </div>
                            </div>
                            <div className="col-2">
                                { !this.props.location.state ? <Modal /> : null }
                            </div>
                        </div>
                        <div className="row userprofile-secondrow">
                            <div className="col-9 userprofile-reviews">
                                { reviews }
                            </div>
                            <div className="col-3">
                                <h5 className="about-username">About { this.state.name }</h5>
                                <strong>Location</strong><br />
                                { this.state.city }, { this.state.state }
                                <br />
                                <strong>Yelping Since</strong><br />
                                { this.state.yelping_since }
                                <br />
                                <strong>Things I Love</strong><br />
                                { this.state.things_love }
                                <br />
                                <strong>Find Me In</strong><br />
                                { this.state.website }
                                <br />
                            </div>
                        </div>
                    </div >
                </div>
            )
        } else {
            window.location.assign( '/login' )
            return null
        }
    }
}

export default UserProfile
