import React, { Component } from 'react'
import axios from 'axios'

import Review from './Review'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class Reviews extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.id,
            active: this.props.active,
            reviews: []
        }
    }

    componentDidMount () {

        // const selected = localStorage.getItem( "active" )
        if ( this.state.active ) {
            if ( this.state.active === "user" ) {
                axios.defaults.withCredentials = true
                if ( this.state.id ) {
                    axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/reviewsForUsers/" + this.state.id )
                        .then( ( res ) => {
                            if ( res.status === 200 ) {
                                this.setState( {
                                    reviews: res.data
                                } )
                                this.props.num_of_reviews( res.data.length )
                            }
                        } )
                        .catch( ( err ) => {
                            if ( err.response ) {
                                if ( err.response.status === 404 ) {
                                    console.log( err.response.message )
                                    return
                                } else if ( err.response.status === 500 ) {
                                    console.log( err.response.message )
                                    return
                                }
                            }
                            return
                        } )
                } else {
                    console.log( "No Id found in local storage" )
                }
            } else {
                axios.defaults.withCredentials = true;
                if ( this.state.id ) {
                    axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/reviewsForRestaurants/" + this.state.id )
                        .then( ( res ) => {
                            if ( res.status === 200 ) {
                                this.setState( {
                                    reviews: res.data
                                } )
                            }
                        } )
                        .catch( ( err ) => {
                            if ( err.response ) {
                                if ( err.response.status === 404 ) {
                                    console.log( err.response.message )
                                    return
                                } else if ( err.response.status === 500 ) {
                                    console.log( err.response.message )
                                    return
                                }
                            }
                            return
                        } )
                } else {
                    console.log( "No Id found in local storage" )
                }
            }
        } else console.log( "No selected found in localstorage" )
    }

    render () {
        return (
            <div className="container">
                <div className="row review-heading">
                    <h2>Reviews</h2>
                </div>
                { this.state.reviews.map( ( review, index ) => {
                    return <Review review={ review } active={ this.state.active } key={ index + "review" } />
                } ) }
            </div>
        )
    }
}
