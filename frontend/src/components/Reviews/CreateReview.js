import React, { Component } from 'react'
import { graphql, compose, withApollo } from 'react-apollo';

import './Review.css'
import { CreateReviewMutation } from '../../mutations/mutations'

class CreateReview extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            restaurant_id: this.props.restaurant_id,
            review_text: "",
            ratings: "1",
            error: ""
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    writeReview = ( item ) => {
        item.preventDefault()
        if ( !this.state.review_text ) {
            this.setState( {
                error: "Review cannot be empty"
            } )
        }
        if ( parseInt( this.state.ratings ) > 5 ) {
            this.setState( {
                error: "Enter ratings between 0 to 5"
            } )
        } else {
            const reviewData = {
                restaurant_id: this.state.restaurant_id,
                user_id: parseInt( localStorage.getItem( "id" ) ),
                review_text: this.state.review_text,
                ratings: parseInt( this.state.ratings )
            }
            this.props.CreateReviewMutation( {
                variables: {
                    ...reviewData
                }
            } ).then( res => {
                if ( res.data ) {
                    window.location.reload();
                }
            } ).catch( err => {
                if ( err.message ) {
                    this.setState( {
                        error: err.message.split( ":" )[ 1 ]
                    } )
                }
            } )
        }
    }

    render () {
        return (
            <div className="container create-review-wrapper">
                <div className="row popup-heading">
                    <h3>Write a Review!</h3>
                </div>
                <form>
                    <div className="form-group row">
                        <div className="col-2">Ratings</div>
                        <div className="col-10">
                            <input type="number" className="form-control" name="ratings" min="1" max="5" onChange={ this.onChange } value={ this.state.ratings } required />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-2">Review</div>
                        <div className="col-10">
                            <textarea type="text" className="form-control" name="review_text" onChange={ this.onChange } value={ this.state.review_text } required />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="text-center">
                            <button type="submit" className="btn red-button" onClick={ this.writeReview }>Submit</button>
                        </div>
                    </div>
                    <div className="row">
                        <p id="error">{ this.state.error }</p>
                    </div>
                </form>
            </div>
        )
    }
}

export default compose(
    withApollo,
    graphql( CreateReviewMutation, { name: "CreateReviewMutation" } ),
)( CreateReview );