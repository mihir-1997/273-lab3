import React, { Component } from 'react'

import './Dish.css'
import { BACKEND_URL, BACKEND_PORT } from '../Config/backendConfig'

export default class Dish extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.dish.id,
            name: this.props.dish.name,
            ingredients: this.props.dish.ingredients,
            description: this.props.dish.description,
            price: this.props.dish.price,
            category: this.props.dish.category,
            image: this.props.dish.image,
            cuisine: this.props.dish.cuisine,
            orderButton: this.props.orderButton,
        }
    }

    onOrder = () => {
        this.props.onOrder( this.state.id, this.state.price )
    }

    render () {
        return (
            <div className="dish">
                <div className="row">
                    <div className="col-3">
                        { this.state.image ? <img src={ BACKEND_URL + ":" + BACKEND_PORT + "/" + this.state.image } alt="dish_image" className="dishimage" /> : null }
                    </div>
                    <div className="col-7">
                        <div className="row">
                            <div className="row"></div>
                            <div className="row">
                                <div className="dishname">
                                    { this.state.name }
                                </div>
                            </div>
                            <div className="row dishingredients">
                                <strong>Ingredients:</strong>&nbsp;{ this.state.ingredients }
                            </div>
                            <div className="row dishdescription">
                                <strong>Description:</strong>&nbsp;{ this.state.description }
                            </div>
                            <div className="row dishcuisine">
                                <strong>Cuisine:</strong>&nbsp;{ this.state.cuisine }
                            </div>
                            <div className="row dishcategory">
                                <strong>Category:</strong>&nbsp;{ this.state.category }
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="row dishprice">
                            ${ this.state.price }
                        </div>
                        { this.props.orderButton ?
                            <div className="row">
                                <button type="button" className="btn red-button orderbutton" onClick={ this.onOrder }>Order</button>
                            </div>
                            : null }
                    </div>
                </div>
            </div>
        )
    }
}
