import React, { Component } from 'react'
import axios from 'axios'

import './UpdateUserProfile.css'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class UpdateProfile extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            ...this.props.user,
            error: ""
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    update = item => {
        item.preventDefault()
        console.log( "update" )
        if ( this.state.error === "" ) {
            const user = {
                name: this.state.name,
                email: this.state.email,
                phone_no: this.state.phone_no,
                nick_name: this.state.nick_name,
                birthdate: this.state.birthdate,
                city: this.state.city,
                state: this.state.state,
                country: this.state.country,
                website: this.state.website,
                headline: this.state.headline,
                profile_picture: this.state.profile_picture,
                yelping_since: this.state.yelping_since,
                things_love: this.state.things_love,
                find_me: this.state.find_me,
            }
            let id = localStorage.getItem( "id" )
            axios.defaults.withCredentials = true;
            console.log( "updfate 2" )
            axios.put( BACKEND_URL + ":" + BACKEND_PORT + "/updateUser/" + id, user )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        localStorage.setItem( "email", res.data.email )
                        console.log( "Profile updated successfully" )
                        window.location.reload();
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( "Error! No user" )
                            this.setState( { "error": "No user found" } )
                        }
                    }
                } )
        }
    }

    checkDate = item => {
        let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
        if ( !date_regex.test( item.target.value ) ) {
            this.setState( {
                error: "Date must be in mm/dd/yyyy"
            } )
        } else {
            this.setState( {
                error: ""
            } )
        }
    }

    render () {
        return (
            <div className="update-profile">
                <div className="container">
                    <div className="row popup-heading">
                        <h3>Enter new details</h3>
                    </div>
                    <form>
                        <div className="form-group row">
                            <div className="col-2">Email</div>
                            <div className="col-10">
                                <input type="email" className="form-control" name="email" placeholder="xyz@gmail.com" onChange={ this.onChange } value={ this.state.email } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Name</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="name" placeholder="Name" onChange={ this.onChange } value={ this.state.name } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Nick Name</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="nick_name" placeholder="Nick Name" onChange={ this.onChange } value={ this.state.nick_name } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Birth Date</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="birthdate" placeholder="mm/dd/yyyy" onChange={ this.onChange } onBlur={ this.checkDate } value={ this.state.birthdate } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">City</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="city" placeholder="City" onChange={ this.onChange } value={ this.state.city } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">State</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="state" placeholder="State" onChange={ this.onChange } value={ this.state.state } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Country</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="country" placeholder="US" onChange={ this.onChange } value={ this.state.country } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Phone No</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="phone_no" placeholder="(xxx)-xxx-xxxx" onChange={ this.onChange } value={ this.state.phone_no } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Headline</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="headline" placeholder="Hi! I am food lover" onChange={ this.onChange } value={ this.state.headline } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Yelping Since</div>
                            <div className="col-10">
                                <input type="number" className="form-control" name="yelping_since" placeholder="YYYY" onChange={ this.onChange } value={ this.state.yelping_since } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Food Likings</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="things_love" placeholder="Pizza, Burger" onChange={ this.onChange } value={ this.state.things_love } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Find Me</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="find_me" placeholder="Find Me" onChange={ this.onChange } value={ this.state.find_me } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Website</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="website" placeholder="https://xyz.com" onChange={ this.onChange } value={ this.state.website } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="text-center">
                                <button type="submit" className="btn red-button" onClick={ this.update }>Update</button>
                            </div>
                        </div>
                        <div className="row">
                            <p id="error">{ this.state.error }</p>
                        </div>
                    </form>
                </div>
            </div >
        )
    }
}
