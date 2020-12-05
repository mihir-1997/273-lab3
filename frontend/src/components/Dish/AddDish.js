import React, { Component } from 'react'
import axios from 'axios'

import './AddDish.css'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class AddDish extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            name: "",
            ingredients: "",
            description: "",
            price: "",
            category: "",
            image: "",
            cuisine: "",
            error: ""
        }
    }

    onChange = item => {
        this.setState( { [ item.target.name ]: item.target.value } );
    }

    onChangeFile = item => {
        this.setState( { image: item.target.files[ 0 ] } );
    }

    add = item => {
        item.preventDefault()
        if ( this.state.name && this.state.price && this.state.category ) {
            let id = localStorage.getItem( "id" )
            console.log( this.state.image )
            const formData = new FormData()
            formData.append( 'restaurant_id', id )
            formData.append( 'file', this.state.image )
            formData.append( 'name', this.state.name )
            formData.append( 'ingredients', this.state.ingredients )
            formData.append( 'description', this.state.description )
            formData.append( 'cuisine', this.state.cuisine )
            formData.append( 'price', this.state.price )
            formData.append( 'category', this.state.category )
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            axios.defaults.withCredentials = true;
            axios.post( BACKEND_URL + ":" + BACKEND_PORT + "/createDish/", formData, config )
                .then( ( res ) => {
                    if ( res.status === 200 ) {
                        console.log( "Dish created successfully" )
                        this.setState( {
                            error: ""
                        } )
                        window.location.reload();
                    }
                } )
                .catch( ( err ) => {
                    if ( err.response ) {
                        console.log( err.response )
                    } else {
                        console.log( err )
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
            <div className="add-dish">
                <div className="container">
                    <div className="row popup-heading">
                        <h3>Add Dish</h3>
                    </div>
                    <form className="adddish-form">
                        <div className="form-group row">
                            <div className="col-2">Name<span className="required-field">*</span></div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="name" onChange={ this.onChange } value={ this.state.name } required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Ingredients</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="ingredients" onChange={ this.onChange } value={ this.state.ingredients } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Description</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="description" onChange={ this.onChange } value={ this.state.description } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Cuisine</div>
                            <div className="col-10">
                                <input type="text" className="form-control" name="cuisine" onChange={ this.onChange } value={ this.state.cuisine } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Price<span className="required-field">*</span></div>
                            <div className="col-10">
                                <input type="number" className="form-control" name="price" min="0" onChange={ this.onChange } value={ this.state.price } required />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Category<span className="required-field">*</span></div>
                            <div className="col-10">
                                <select id="category" name="category" onChange={ this.onChange } required>
                                    <option value="">-- Select --</option>
                                    <option value="Appetizer">Appetizer</option>
                                    <option value="Salads">Salads</option>
                                    <option value="Main Course">Main Course</option>
                                    <option value="Desserts">Desserts</option>
                                    <option value="Beverages">Beverages</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">Image</div>
                            <div className="col-10">
                                <input type="file" name="file" onChange={ this.onChangeFile } />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="text-center">
                                <button type="submit" className="btn red-button" onClick={ this.add }>Add</button>
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
