import React, { Component } from 'react'
import { graphql, compose, withApollo } from 'react-apollo';

import Review from './Review'
import { GetReviewsForUser, GetReviewsForRestaurant } from '../../queries/queries'

class Reviews extends Component {

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
                if ( this.state.id ) {
                    this.props.client.query( {
                        query: GetReviewsForUser,
                        variables: {
                            id: parseInt( this.state.id )
                        }
                    } ).then( res => {
                        if ( res.data ) {
                            this.setState( {
                                reviews: res.data.getReviewsForUsers
                            } )
                        }
                    } ).catch( err => {
                        if ( err.message ) {
                            this.setState( {
                                error: err.message.split( ":" )[ 1 ]
                            } )
                        }
                    } )
                } else {
                    console.log( "No Id found in local storage" )
                }
            } else {
                if ( this.state.id ) {
                    this.props.client.query( {
                        query: GetReviewsForRestaurant,
                        variables: {
                            id: this.state.id
                        }
                    } ).then( res => {
                        if ( res.data ) {
                            this.setState( {
                                reviews: res.data.getReviewsForRestaurants
                            } )
                        }
                    } ).catch( err => {
                        if ( err.message ) {
                            this.setState( {
                                error: err.message.split( ":" )[ 1 ]
                            } )
                        }
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
                { this.state.reviews ?
                    this.state.reviews.map( ( review, index ) => {
                        return <Review review={ review } active={ this.state.active } key={ index + "review" } />
                    } )
                    : null }
            </div>
        )
    }
}

export default compose(
    withApollo,
    graphql( GetReviewsForUser, { name: "GetReviewsForUser" } ),
    graphql( GetReviewsForRestaurant, { name: "GetReviewsForRestaurant" } ),
)( Reviews );