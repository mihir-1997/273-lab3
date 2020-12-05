import React, { Component } from 'react'
import axios from 'axios'

import './UpdateUserProfile.css'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class UpdateRestaurant extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            ...this.props.restaurant,
            error: ""
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    onChangeCurbside = item => {
        console.log( item.target.name )
        console.log( this.state.curbside_pickup )
        this.setState( { curbside_pickup: !this.state.curbside_pickup } );
        console.log( this.state.curbside_pickup )
    }

    onChangeDineIn = item => {
        this.setState( { dine_in: !this.state.dine_in } );
    }

    onChangeDelivery = item => {
        this.setState( { delivery: !this.state.delivery } );
    }

    update = item => {
        item.preventDefault()
        if ( this.state.email && this.state.address && this.state.city && this.state.state && this.state.zipcode ) {
            const restaurant = {
                name: this.state.name,
                email: this.state.email,
                phone_no: this.state.phone_no,
                address: this.state.address,
                city: this.state.city,
                state: this.state.state,
                zipcode: this.state.zipcode,
                description: this.state.description,
                timings: this.state.timings,
                curbside_pickup: this.state.curbside_pickup,
                dine_in: this.state.dine_in,
                delivery: this.state.delivery
            }
            let id = localStorage.getItem( "id" )
            axios.defaults.withCredentials = true;
            axios.put( BACKEND_URL + ":" + BACKEND_PORT + "/updateRestaurant/" + id, restaurant )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        localStorage.setItem( "email", res.data.email )
                        console.log( "Profile updated successfully" )
                        this.setState( {
                            error: ""
                        } )
                        window.location.reload();
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        if ( err.response.status === 404 ) {
                            console.log( "Error! No restaurant" )
                            this.setState( { "error": "No restaurant found" } )
                        }
                    }
                } )
        } else {
            this.setState( {
                error: "*Some required fields are empty"
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
                            <div className="col-2">Email<span className="required-field">*</span></div>
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
                            <div className="col-2">Address<span className="required-field">*</span></div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="address" placeholder="" onChange={ this.onChange } value={ this.state.address } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">City<span className="required-field">*</span></div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="city" placeholder="San Jose" onChange={ this.onChange } value={ this.state.city } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">State<span className="required-field">*</span></div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="state" placeholder="CA" onChange={ this.onChange } value={ this.state.state } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Zipcode<span className="required-field">*</span></div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="zipcode" placeholder="12345" onChange={ this.onChange } value={ this.state.zipcode } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Phone No</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="phone_no" placeholder="(xxx)-xxx-xxxx" onChange={ this.onChange } value={ this.state.phone_no } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Description</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="description" placeholder="We serve quality food!" onChange={ this.onChange } value={ this.state.description } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Timings</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="timings" placeholder="Timings" onChange={ this.onChange } value={ this.state.timings } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Select that apply</div>
                            <div className="col-10">
                                <input type="checkbox" name="curbside_pickup" value="curbside" onChange={ this.onChangeCurbside } checked={ !!this.state.curbside_pickup } /><span> Curbside Pickup    </span>
                                <input type="checkbox" name="dine_in" value="open" onChange={ this.onChangeDineIn } checked={ !!this.state.dine_in } /><span> Dine In    </span>
                                <input type="checkbox" name="delivery" value="delivey" onChange={ this.onChangeDelivery } checked={ !!this.state.delivery } /><span> Yelp Delivery  </span>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="text-center">
                                <button type="submit" className="btn red-button" onClick={ this.update }>Update</button>
                            </div>
                        </div>
                    </form>
                    <div className="row">
                        <div className="text-center">
                            <span className="required-field">{ this.state.error }</span>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
