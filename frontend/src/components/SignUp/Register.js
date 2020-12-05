import React, { Component } from 'react'
import axios from 'axios'

import Login_logo from "../../Images/Login_logo.png"
import './Signup.css'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export class register extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            name: "",
            email: "",
            password: "",
            address: "",
            city: "",
            state: "",
            zipcode: "",
            selected: "user",
            error: "",
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    radioChange = item => {
        console.log( item.target.value )
        this.setState( {
            selected: item.target.value
        } )
    }

    login = () => {
        window.location.assign( '/login' )
    }

    register = item => {
        item.preventDefault()
        if ( this.state.email && this.state.password ) {
            const re_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const re_password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
            if ( !re_email.test( this.state.email.toLowerCase() ) ) {
                this.setState( {
                    error: "Please enter valid email"
                } )
                return
            } else {
                this.setState( {
                    error: ""
                } )
            }
            if ( !re_password.test( this.state.password ) ) {
                this.setState( {
                    error: "Password must contain lowercase, uppercase, digits and of minumim length of 8"
                } )
                return
            } else {
                this.setState( {
                    error: ""
                } )
            }
            if ( this.state.selected === "user" ) {
                if ( this.state.name && this.state.email && this.state.password ) {
                    const user = {
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password,
                    }
                    axios.defaults.withCredentials = true;
                    axios.post( BACKEND_URL + ":" + BACKEND_PORT + "/registerUser", user )
                        .then( ( res ) => {
                            if ( res.status === 200 ) {
                                console.log( "User added successfully" )
                                this.setState( {
                                    error: ""
                                } )
                                window.location.assign( '/login' )
                            } else {
                                console.log( "Error creating user" )
                            }
                        } )
                        .catch( ( err ) => {
                            if ( err.response ) {
                                if ( err.response.status === 409 ) {
                                    this.setState( { "error": "User already exist" } )
                                }
                            }
                        } )
                } else {
                    this.setState( {
                        error: "*Some required fields are empty"
                    } )
                }
            } else {
                if ( this.state.name && this.state.email && this.state.address && this.state.city && this.state.state && this.state.zipcode && this.state.password ) {
                    const restaurant = {
                        name: this.state.name,
                        email: this.state.email,
                        address: this.state.address,
                        city: this.state.city,
                        state: this.state.state,
                        zipcode: this.state.zipcode,
                        password: this.state.password,
                    }
                    axios.defaults.withCredentials = true;
                    axios.post( BACKEND_URL + ":" + BACKEND_PORT + "/registerRestaurant", restaurant )
                        .then( ( res ) => {
                            if ( res.status === 200 ) {
                                console.log( "Restaurant added successfully" )
                                window.location.assign( '/login' )
                            } else {
                                console.log( "Error creating restaurant" )
                            }
                        } )
                        .catch( ( err ) => {
                            if ( err.response ) {
                                if ( err.response.status === 409 ) {
                                    this.setState( { "error": "Restaurant already exist" } )
                                }
                            }
                        } )
                } else {
                    this.setState( {
                        error: "*Some required fields are empty"
                    } )
                }
            }
        }
    }

    render () {
        if ( localStorage.getItem( "email" ) ) {
            window.location.assign( '/profile' )
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-5">
                        <div className="login">
                            <h4>Sign Up for Yelp</h4>
                            <input
                                type="radio"
                                name="selected"
                                onChange={ this.radioChange }
                                value="user"
                                required />
                            <label
                                htmlFor="user">Customer</label>
                            <input
                                type="radio"
                                name="selected"
                                onChange={ this.radioChange }
                                value="restaurant"
                                required />
                            <label
                                htmlFor="restaurant">Restaurant</label>
                            <form
                                onSubmit={ this.register }>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={ this.state.name }
                                        onChange={ this.onChange }
                                        className="form-control"
                                        required />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={ this.state.email }
                                        onChange={ this.onChange }
                                        className="form-control"
                                        required />
                                </div>
                                { this.state.selected === "restaurant" &&
                                    <div >
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="Address"
                                                onChange={ this.onChange }
                                                value={ this.state.address }
                                                className="form-control"
                                                required />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="City"
                                                onChange={ this.onChange }
                                                value={ this.state.city }
                                                className="form-control"
                                                required />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="state"
                                                placeholder="State"
                                                onChange={ this.onChange }
                                                value={ this.state.state }
                                                className="form-control"
                                                required />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="zipcode"
                                                placeholder="Zipcode"
                                                onChange={ this.onChange }
                                                value={ this.state.zipcode }
                                                className="form-control"
                                                required />
                                        </div>
                                    </div>
                                }
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        onChange={ this.onChange }
                                        value={ this.state.password }
                                        className="form-control"
                                        required />
                                </div>

                                <button
                                    type="submit"
                                    id="submit"
                                    className="btn login-button"
                                >Sign Up</button>
                            </form>
                            <br />
                            <a href="/login"> Already have an account? Login</a>
                            <div className="row">
                                <p id="error">{ this.state.error }</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="login-logo">
                            <img src={ Login_logo } className="login-logo-image" alt="login-logo"></img>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    loginStyle = {
        color: "white"
    }
}

export default register
