import React, { Component } from 'react'
import { graphql, compose, withApollo } from 'react-apollo';

import './AddDish.css'
import { AddDishMutation } from '../../mutations/mutations'

class AddDish extends Component {

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
            this.props.AddDishMutation( {
                variables: {
                    restaurant_id: parseInt( id ),
                    name: this.state.name,
                    ingredients: this.state.ingredients,
                    price: parseFloat( this.state.price ),
                    description: this.state.description,
                    category: this.state.category,
                    cuisine: this.state.cuisine,
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

export default compose(
    withApollo,
    graphql( AddDishMutation, { name: "AddDishMutation" } ),
)( AddDish );