import React, { Component } from 'react'
import axios from 'axios'

import './UserPage.css'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class UserPage extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.user_id,
            name: "",
            phone_no: "",
            city: "",
            state: "",
            country: "",
            website: "",
            headline: "",
            profile_picture: "",
            yelping_since: "",
            things_love: "",
            find_me: "",
        }
    }

    componentDidMount () {
        axios.get( BACKEND_URL + ":" + BACKEND_PORT + "/getuser/" + this.state.id )
            .then( ( res ) => {
                if ( res.status === 200 ) {
                    this.setState( {
                        name: res.data.name,
                        phone_no: res.data.phone_no,
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
    }

    render () {
        return (
            <div className="container userpage-wrapper">
                <div className="row userpage">
                    <div className="col-3">
                        <div className="h-100">
                            <div className="profile-picture">
                                <img src={ BACKEND_URL + ":" + BACKEND_PORT + "/" + this.state.profile_picture } alt="profile" className="profile_pic" crossOrigin="anonymous"></img>
                            </div>
                        </div>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-8">
                        <div className="row">
                            <div className="col-7">
                                <div className="row username">
                                    { this.state.name }
                                </div>
                                <div className="row userlocation">
                                    { this.state.city }, { this.state.state }
                                </div>
                                <div className="row usersince">
                                    <strong>Since:</strong>{ this.state.yelping_since }
                                </div>
                                <div className="row userdescription">
                                    <strong>Headline:</strong> { this.state.headline }
                                </div>
                            </div>
                            <div className="col-5">
                                <div className="row userwebsite">
                                    <a href={ this.state.website }>{ this.state.website }</a>
                                </div>
                                <div className="row userlove">
                                    <strong>Food Likings:</strong> { this.state.things_love }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
