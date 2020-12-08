import React, { Component } from 'react'
import { Redirect } from 'react-router';
import { graphql, compose, withApollo } from 'react-apollo';

import './Orders.css'
import { GetOrdersForUserQuery } from '../../queries/queries'

class Orders extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            orders: [],
            filtered_orders: [],
            Ordered: "",
            Delivered: false,
            Preparing: false,
            Cancelled: false,
            filtered: false,
            On_the_Way: false,
            Ready_to_Pickup: false,
            Picked_Up: false
        }
    }

    componentDidMount () {
        let id = localStorage.getItem( "id" )
        if ( id ) {
            this.props.client.query( {
                query: GetOrdersForUserQuery,
                variables: {
                    user_id: parseInt( id )
                }
            } ).then( res => {
                if ( res.data ) {
                    this.setState( {
                        orders: res.data.getOrdersForUsers,
                        filtered_orders: res.data.getOrdersForUsers
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

    filterOrder = () => {
        this.setState( {
            filtered_orders: this.state.filtered_orders.filter( order => order.status === this.state.filtered )
        } )

    }

    onChange = ( e ) => {
        if ( e.target.value ) {
            if ( e.target.value === "ascending" ) {
                this.setState( {
                    filtered_orders: this.state.filtered_orders.sort( ( a, b ) => {
                        return new Date( parseInt( a.order_date ) ) - new Date( parseInt( b.order_date ) )
                    } )
                } )
            } else {
                this.setState( {
                    filtered_orders: this.state.filtered_orders.sort( ( a, b ) => {
                        return new Date( parseInt( b.order_date ) ) - new Date( parseInt( a.order_date ) )
                    } )
                } )
            }
        }
    }

    onChangeFilter = ( item ) => {
        if ( this.state.filtered ) {
            if ( item.target.value === "On the Way" ) {
                this.setState( {
                    filtered: "",
                    filtered_orders: this.state.orders,
                    On_the_Way: false
                } )
                return
            } else if ( item.target.value === "Ready to Pickup" ) {
                this.setState( {
                    filtered: "",
                    filtered_orders: this.state.orders,
                    Ready_to_Pickup: false
                } )
                return
            } else if ( item.target.value === "Picked Up" ) {
                this.setState( {
                    filtered: "",
                    filtered_orders: this.state.orders,
                    Picked_Up: false
                } )
                return
            } else {
                this.setState( {
                    filtered: "",
                    filtered_orders: this.state.orders,
                    [ item.target.value ]: !this.state[ item.target.value ]
                } )
                return
            }
        } else {
            if ( item.target.value === "On the Way" ) {
                this.setState( {
                    filtered: item.target.value,
                    On_the_Way: !this.state.On_the_Way
                }, this.filterOrder )
            } else if ( item.target.value === "Ready to Pickup" ) {
                this.setState( {
                    filtered: item.target.value,
                    Ready_to_Pickup: !this.state.Ready_to_Pickup
                }, this.filterOrder )
            } else if ( item.target.value === "Picked Up" ) {
                this.setState( {
                    filtered: item.target.value,
                    Picked_Up: !this.state.Picked_Up
                }, this.filterOrder )
            } else {
                this.setState( {
                    filtered: item.target.value,
                    [ item.target.value ]: !this.state[ item.target.value ]
                }, this.filterOrder )
            }
        }
    }

    render () {
        var redirectVar = null
        if ( localStorage.getItem( "active" ) !== "user" ) {
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
                                    <input type="checkbox" name="order_method" value="Ordered" onChange={ this.onChangeFilter } disabled={ this.state.Preparing || this.state.Delivered || this.state.Cancelled || this.state.On_the_Way || this.state.Ready_to_Pickup || this.state.Picked_Up } /> Ordered<br />
                                    <input type="checkbox" name="order_method" value="Preparing" onChange={ this.onChangeFilter } disabled={ this.state.Ordered || this.state.Delivered || this.state.Cancelled || this.state.On_the_Way || this.state.Ready_to_Pickup || this.state.Picked_Up } /> Preparing<br />
                                    <input type="checkbox" name="order_method" value="Delivered" onChange={ this.onChangeFilter } disabled={ this.state.Ordered || this.state.Preparing || this.state.Cancelled || this.state.On_the_Way || this.state.Ready_to_Pickup || this.state.Picked_Up } /> Delivered<br />
                                    <input type="checkbox" name="order_method" value="Cancelled" onChange={ this.onChangeFilter } disabled={ this.state.Delivered || this.state.Ordered || this.state.Preparing || this.state.On_the_Way || this.state.Ready_to_Pickup || this.state.Picked_Up } /> Cancelled<br />
                                    <input type="checkbox" name="order_method" value="On the Way" onChange={ this.onChangeFilter } disabled={ this.state.Delivered || this.state.Cancelled || this.state.Ordered || this.state.Preparing || this.state.Ready_to_Pickup || this.state.Picked_Up } /> On the Way<br />
                                    <input type="checkbox" name="order_method" value="Ready to Pickup" onChange={ this.onChangeFilter } disabled={ this.state.Delivered || this.state.Cancelled || this.state.On_the_Way || this.state.Ordered || this.state.Preparing || this.state.Picked_Up } /> Ready to Pickup<br />
                                    <input type="checkbox" name="order_method" value="Picked Up" onChange={ this.onChangeFilter } disabled={ this.state.Delivered || this.state.Cancelled || this.state.On_the_Way || this.state.Ready_to_Pickup || this.state.Ordered || this.state.Preparing } /> Picked Up<br />
                                </div>
                            </div>
                        </div>
                        <div className="col-10">
                            <h2 className="order-heading">Orders</h2>
                            <div className="row">
                                <div className="col-9"></div>
                                <div className="col-3">
                                    <form>
                                        <select name="sortOption" id="sortOptions" className="form-control sortOptions" onChange={ this.onChange }>
                                            <option name="sort" value="">Sort By Date...</option>
                                            <option name="sort" value="ascending">Ascending</option>
                                            <option name="sort" value="descending">Descending</option>
                                        </select>
                                    </form>
                                </div>
                            </div>
                            {
                                this.state.filtered_orders ?
                                    this.state.filtered_orders.map( ( order, index ) => {
                                        return (
                                            <div className="row single-order" key={ index }>
                                                <div className="col">
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <span className="small-font">Status:</span>
                                                        </div>
                                                        <div className="col-3">
                                                            <span className="small-font">Order Date:</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="small-font">Dish:</span>
                                                        </div>
                                                        <div className="col-3">
                                                            <span className="small-font">Restaurant:</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="small-font">Total:</span>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-2">
                                                            <span className="order-details">{ order.status }</span>
                                                        </div>
                                                        <div className="col-3">
                                                            <span className="order-details">{ getDate( order.order_date ) }</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="order-details">{ order.dish_name }</span>
                                                        </div>
                                                        <div className="col-3">
                                                            <span className="order-details">{ order.restaurant_name }</span>
                                                        </div>
                                                        <div className="col-2">
                                                            <span className="order-details">${ order.total }</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    } )
                                    : "No orders"
                            }
                        </div >
                    </div>
                </div >
            </div>
        )
    }
}

export default compose(
    withApollo,
    graphql( GetOrdersForUserQuery, { name: "GetOrdersForUserQuery" } ),
)( Orders );