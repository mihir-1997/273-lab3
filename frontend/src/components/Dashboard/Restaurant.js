import React, { Component } from 'react'
import axios from 'axios';

import './Restaurant.css'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

class Restaurant extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            avgRatings: "",
            num_of_reviews: ""
        }
    }

    componentDidMount () {
        console.log( process.env.REACT_APP_BACKEND_PORT )
        if ( this.props.restautantData.id ) {
            axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/averageRatingsForRestaurant/" + this.props.restautantData.id )
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
        }
    }

    onClick = ( item ) => {
        this.props.onClick( this.props.restautantData.id, this.state.avgRatings, this.state.num_of_reviews )
    }

    render () {
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
            <div className="row each-restaurant" onClick={ this.onClick }>
                <div className="col-4">
                    { this.props.restautantData.image ?
                        <img src={ BACKEND_URL + ":" + BACKEND_PORT + "/" + this.props.restautantData.image } className="each-restaurant-image" alt="res_pic" /> : null }
                </div>
                <div className="col-6">
                    <div className="row restaurant-name">
                        <h3>{ this.props.restautantData.name }</h3>
                    </div>
                    <div className="row ">
                        <div className="restaurant-ratings-mainpage">{ ratings() }</div>
                        <div className="num-of-reviews">&nbsp; { this.state.num_of_reviews }</div>
                    </div>
                    <div className="row restaurant-delivery">
                        {
                            this.props.restautantData.curbside_pickup ?
                                <svg viewBox="-2 -2 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M1 7l4.5 4.5L14 3" stroke="#05a882" strokeLinecap="square"></path></svg>
                                :
                                <svg viewBox="-2 -2 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M1.5 1.5l12 12m-12 0l12-12" stroke="#05a882"></path></svg>

                        }
                        &nbsp;<span className="curbside">Curbside Pickup</span>&nbsp;&nbsp;
                        {
                            this.props.restautantData.dine_in ?
                                <svg viewBox="-2 -2 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M1 7l4.5 4.5L14 3" stroke="#05a882" strokeLinecap="square"></path></svg>
                                :
                                <svg viewBox="-2 -2 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M1.5 1.5l12 12m-12 0l12-12" stroke="#05a882"></path></svg>

                        }
                        &nbsp;<span className="open">Dine In</span>&nbsp;&nbsp;
                        {
                            this.props.restautantData.delivery ?
                                <svg viewBox="-2 -2 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M1 7l4.5 4.5L14 3" stroke="#05a882" strokeLinecap="square"></path></svg>
                                :
                                <svg viewBox="-2 -2 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path d="M1.5 1.5l12 12m-12 0l12-12" stroke="#05a882"></path></svg>

                        }
                        &nbsp;<span className="delivery">Yelp Delivery</span>
                    </div>
                    <div className="row restaurant-description">
                        <strong>Description</strong>: { this.props.restautantData.description }
                    </div>
                </div>
                <div className="col-2 contactinfo">
                    {/* { this.props.restautantData.email }<br /> */ }
                    { this.props.restautantData.phone_no }<br />
                    { this.props.restautantData.address }<br />
                    { this.props.restautantData.city }<br />
                    {/* { this.props.restautantData.timings } */ }
                </div>
            </div>
        )
    }
}

export default Restaurant;
