import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { graphql, compose, withApollo } from 'react-apollo';

import './Orders.css'
import { GetOrdersForRestaurantQuery } from '../../queries/queries'
import { UpdateOrderStatusMutation } from '../../mutations/mutations'

class RestaurantOrders extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            orders: [],
            filtered_orders: [],
            Ordered: "",
            Delivered: false,
            Preparing: false,
            Cancelled: false,
            filtered: false
        }
    }

    componentDidMount () {
        let id = localStorage.getItem( "id" )
        if ( id ) {
            this.props.client.query( {
                query: GetOrdersForRestaurantQuery,
                variables: {
                    restaurant_id: parseInt( id )
                }
            } ).then( res => {
                if ( res.data ) {
                    this.setState( {
                        orders: res.data.getOrdersForRestaurants,
                        filtered_orders: res.data.getOrdersForRestaurants
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

    onStatusChange = ( item ) => {
        let order_id = item.target.value.split( "_" )[ 1 ]
        if ( item.target.value ) {
            if ( window.confirm( "Do you want to update status?" ) ) {
                this.props.UpdateOrderStatusMutation( {
                    variables: {
                        id: parseInt( order_id ),
                        updated_status: item.target.value.split( "_" )[ 0 ]
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
    }

    filterOrder = () => {
        if ( this.state.filtered === "Delivered" ) {
            this.setState( {
                filtered_orders: this.state.filtered_orders.filter( order => order.status === this.state.filtered || order.status === "Picked Up" )
            } )
        } else {
            this.setState( {
                filtered_orders: this.state.filtered_orders.filter( order => order.status === this.state.filtered )
            } )
        }
    }

    onChangeFilter = ( item ) => {
        if ( this.state.filtered ) {
            this.setState( {
                filtered: "",
                filtered_orders: this.state.orders,
                [ item.target.value ]: !this.state[ item.target.value ]
            } )
            return
        } else {
            this.setState( {
                filtered: item.target.value,
                [ item.target.value ]: !this.state[ item.target.value ]
            }, this.filterOrder )
        }
    }

    showUserProfile = ( user_id ) => {
        console.log( user_id )
        return this.props.history.push( {
            pathname: '/userprofile',
            state: {
                user_id: user_id,
            }
        } )
    }

    render () {
        var redirectVar = null
        if ( localStorage.getItem( "active" ) !== "restaurant" ) {
            redirectVar = <Redirect to="/login" />
            return redirectVar
        }
        let getDate = ( old ) => {
            let date = new Date( parseInt( old ) )
            return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear()
        }
        return (
            <div >
                {redirectVar }
                <div className="container restaurant-orders-wrapper">
                    <div className="row restaurant-orders">
                        <div className="col-2">
                            <div className="h-10"></div>
                            <div className="h-75">
                                <h5>Order Filters</h5>
                                <div className="order_filters">
                                    <input type="checkbox" name="order_method" value="Ordered" onChange={ this.onChangeFilter } disabled={ this.state.Delivered || this.state.Cancelled || this.state.Preparing } /> New Order<br />
                                    <input type="checkbox" name="order_method" value="Preparing" onChange={ this.onChangeFilter } disabled={ this.state.Ordered || this.state.Delivered || this.state.Cancelled } /> Preparing<br />
                                    <input type="checkbox" name="order_method" value="Delivered" onChange={ this.onChangeFilter } disabled={ this.state.Ordered || this.state.Cancelled || this.state.Preparing } /> Delivered<br />
                                    <input type="checkbox" name="order_method" value="Cancelled" onChange={ this.onChangeFilter } disabled={ this.state.Ordered || this.state.Delivered || this.state.Preparing } /> Cancelled<br />
                                </div>
                            </div>
                        </div>
                        <div className="col-10">
                            <h2 className="order-heading">Orders</h2>

                            {
                                this.state.filtered_orders ?
                                    this.state.filtered_orders.map( order => {
                                        let updateStatus = null
                                        let disableSelect = false
                                        if ( order.status === "Delivered" || order.status === "Picked Up" || order.status === "Cancelled" ) {
                                            disableSelect = true
                                        }
                                        if ( order.delivery_option === "pickup" ) {
                                            updateStatus = ( order_id ) => (
                                                <select name="updateStatusOption" id="updateStatusOptions" className="updateStatusOptions" onChange={ this.onStatusChange } disabled={ disableSelect }>
                                                    <option name="updateStatus" value="">Update</option>
                                                    <option name="updateStatus" value={ "Preparing_" + order_id }>Preparing</option>
                                                    <option name="updateStatus" value={ "Ready to Pickup_" + order_id }>Ready</option>
                                                    <option name="updateStatus" value={ "Picked Up_" + order_id }>Picked Up</option>
                                                    <option name="updateStatus" value={ "Cancelled_" + order_id }>Cancel</option>
                                                </select>
                                            )
                                        } else {
                                            updateStatus = ( order_id ) => (
                                                <select name="updateStatusOption" id="updateStatusOptions" className="updateStatusOptions" onChange={ this.onStatusChange } disabled={ disableSelect }>
                                                    <option name="updateStatus" value="">Update</option>
                                                    <option name="updateStatus" value={ "Preparing_" + order_id }>Preparing</option>
                                                    <option name="updateStatus" value={ "On the Way_" + order_id }>On the Way</option>
                                                    <option name="updateStatus" value={ "Delivered_" + order_id }>Delivered</option>
                                                    <option name="updateStatus" value={ "Cancelled_" + order_id }>Cancel</option>
                                                </select>
                                            )
                                        }
                                        return (
                                            <div className="row single-order">
                                                <div className="col">
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <span className="small-font">Current Status:</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="small-font">Order Date:</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="small-font">Dish:</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="small-font">Customer:</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="small-font">Total:</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="small-font">Update Status:</span>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <span className="order-details">{ order.status }</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="order-details">{ getDate( order.order_date ) }</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="order-details">{ order.dish_name }</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="order-details"><button type="button" className="btn btn-secondary" onClick={ () => this.showUserProfile( order.user_id ) }>{ order.user_name }</button></span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="order-details">${ order.total }</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="order-details">{ updateStatus( order.id ) }</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } )
                                    : "No orders"
                            }
                        </div>
                    </div>
                </div >
            </div>
        )
    }
}

export default compose(
    withApollo,
    graphql( GetOrdersForRestaurantQuery, { name: "GetOrdersForRestaurantQuery" } ),
    graphql( UpdateOrderStatusMutation, { name: "UpdateOrderStatusMutation" } ),
)( RestaurantOrders );