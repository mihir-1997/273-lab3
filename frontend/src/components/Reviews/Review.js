import React, { Component } from 'react'

export default class Review extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.review.id,
            user_id: this.props.review.user_id,
            restaurant_id: this.props.review.restaurant_id,
            review_text: this.props.review.review_text,
            ratings: this.props.review.ratings,
            date: this.props.review.date.split( "T" )[ 0 ],
            restaurant_name: this.props.review.name,
            restaurant_address: this.props.review.restaurant_address,
            restaurant_city: this.props.review.restaurant_city,
            restaurant_state: this.props.review.restaurant_state,
            restaurant_zipcode: this.props.review.restaurant_zipcode,
            user_name: this.props.review.name,
            user_city: this.props.review.city,
            user_state: this.props.review.state,
            active: this.props.active
        }
    }
    render () {
        var EachReview = null
        let ratings = () => {
            ratings = parseInt( this.state.ratings )
            var out = []
            for ( let i = 0; i < ratings; i++ ) {
                out.push( <span className="fa fa-star checked"></span> )
            }
            for ( let i = ratings + 1; i < 6; i++ ) {
                out.push( <span className="fa fa-star"></span> )
            }
            return out
        }
        if ( this.state.active === "user" ) {
            EachReview = () => {
                return (
                    <div className="row each-review-restaurant">
                        <div className="col">
                            <h4 className="review-restaurant-name">{ this.state.restaurant_name }</h4>
                            { this.state.restaurant_address }, { this.state.restaurant_city }, { this.state.restaurant_state } { this.state.restaurant_zipcode }<br />
                            { ratings() }&nbsp;<span className="reviewdate">{ this.state.date }</span><br />
                            { this.state.review_text }
                        </div>
                    </div>
                )
            }
        } else {
            EachReview = () => {
                return (
                    <div className="row each-review-user">
                        <div className="col">
                            <h4 className="reviewername">{ this.state.user_name }</h4>
                            { ratings() }&nbsp;<span className="reviewdate">{ this.state.date }</span><br />
                            <span className="reviewerlocation">{ this.state.user_city },{ this.state.user_state }</span><br />
                            { this.state.review_text }
                        </div>
                    </div>
                )
            }
        }

        return (
            <EachReview />
        )
    }
}
