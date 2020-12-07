import React, { Component } from 'react'
import Popup from 'reactjs-popup';
import { graphql, compose, withApollo } from 'react-apollo';

import Dish from "./Dish"
import UpdateAddedDish from '../Dish/UpdateDish'
import { GetDishes } from '../../queries/queries'

class Dishes extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            id: this.props.id,
            dishes: [],
            orderButton: this.props.orderButton,
        }
    }

    onOrder = ( dishId, dishPrice ) => {
        this.props.onOrder( dishId, dishPrice )
    }

    componentDidMount () {
        if ( this.state.id ) {
            this.props.client.query( {
                query: GetDishes,
                variables: {
                    restaurant_id: this.state.id
                }
            } ).then( res => {
                if ( res.data ) {
                    this.setState( {
                        dishes: res.data.getDishes
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

    render () {

        const overlayStyle = { background: 'rgba(0,0,0,0.5)' };
        const arrowStyle = { color: '#000' }; // style for an svg element
        const UpdateDish = ( dish ) => (
            <Popup
                trigger={ <input type="radio" name="dish" value={ dish.dish.id } style={ this.radioButtons }></input> }
                { ...{ dish, overlayStyle, arrowStyle } }
                position="right bottom">
                <UpdateAddedDish dish={ dish.dish } />
            </Popup>
        );
        return (
            <div className="row" style={ this.style }>
                <div className="col">
                    { this.state.dishes.map( dish => {
                        return (
                            <div className="row" key={ dish.id + "div-row" }>
                                {this.state.orderButton ? null :
                                    <div className="col-1" key={ dish.id + "col-1" }>
                                        <div style={ { marginTop: "70%" } }>
                                            { this.props.radioShow ? <UpdateDish dish={ dish } /> : null }
                                        </div>
                                    </div>
                                }
                                <div className="col">
                                    <Dish dish={ dish } onOrder={ this.onOrder } orderButton={ this.props.orderButton }></Dish>
                                </div>
                            </div>
                        )
                    } ) }
                </div>
            </div >
        )
    }
    style = {
        margin: "20px 0 40px"
    }

    radioButtons = {
        float: "right",
        // marginTop: "40%"
    }
}

export default compose(
    withApollo,
    graphql( GetDishes, { name: "GetDishes" } ),
    // graphql( GetAvgRatingsQuery, { name: "GetAvgRatingsQuery" } ),
)( Dishes );