import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { graphql, compose, withApollo } from 'react-apollo';

import Login_logo from "../../Images/Login_logo.png"
import './Signup.css'

import { UserLoginQuery, RestaurantLoginQuery } from '../../queries/queries'



class Login extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            email: "",
            password: "",
            selected: "user",
            error: ""
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

    register = () => {
        window.location.assign( '/register' )
    }

    login = item => {
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
                this.props.client.query( {
                    query: UserLoginQuery,
                    variables: {
                        email: this.state.email,
                        password: this.state.password,
                    }
                } ).then( res => {
                    console.log( res.data )
                    if ( res.data ) {
                        localStorage.setItem( "email", res.data.loginUser.email )
                        localStorage.setItem( "id", res.data.loginUser.id )
                        localStorage.setItem( "active", "user" )
                        console.log( "User Loggedin successfully" )
                        window.location.assign( '/userdashboard' )
                    }
                } ).catch( err => {
                    if ( err.message ) {
                        this.setState( {
                            error: err.message.split( ":" )[ 1 ]
                        } )
                    }
                } )
            } else {
                this.props.client.query( {
                    query: RestaurantLoginQuery,
                    variables: {
                        email: this.state.email,
                        password: this.state.password,
                    }
                } ).then( res => {
                    console.log( res.data )
                    if ( res.data ) {
                        localStorage.setItem( "email", res.data.loginRestaurant.email )
                        localStorage.setItem( "id", res.data.loginRestaurant.id )
                        localStorage.setItem( "active", "restaurant" )
                        console.log( "User Loggedin successfully" )
                        window.location.assign( '/restaurantprofile' )
                    }
                } ).catch( err => {
                    if ( err.message ) {
                        this.setState( {
                            error: err.message.split( ":" )[ 1 ]
                        } )
                    }
                } )
            }
        } else {
            this.setState( {
                error: "Each field is required"
            } )
        }
    }

    render () {
        let redirectVar = null
        if ( localStorage.getItem( "email" ) && localStorage.getItem( "active" ) === "user" ) {
            redirectVar = <Redirect to="/userDashboard" />
            return redirectVar
        } else if ( localStorage.getItem( "email" ) && localStorage.getItem( "active" ) === "restaurant" ) {
            redirectVar = <Redirect to="/restaurantprofile" />
            return redirectVar
        }
        return (
            <div>
                { redirectVar }
                <div className="container">
                    <div className="row">
                        <div className="col-5">
                            <div className="login">
                                <h4>Log in to Yelp</h4>
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
                                <form>
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
                                        onClick={ this.login }>Log In</button>
                                </form>
                                <br />
                                <a href="/register"> Don't have account? Sign up</a>
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
            </div>
        )
    }

    registerStyle = {
        color: "white"
    }
}

export default compose(
    withApollo,
    graphql( UserLoginQuery, { name: "UserLoginQuery" } ),
    graphql( RestaurantLoginQuery, { name: "RestaurantLoginQuery" } ),
)( Login );
