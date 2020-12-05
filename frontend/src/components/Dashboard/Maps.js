import React, { Component } from 'react'
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
require( 'dotenv' ).config(
    { path: "../../../.env" }
);

class Maps extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            latLongs: this.props.latlongs,
            showingInfoWindow: false,  // Hides or shows the InfoWindow
            activeMarker: {},          // Shows the active marker upon click
            selectedPlace: {},
        }
    }

    onMarkerClick = ( props, marker, e ) =>
        this.setState( {
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        } );

    onClose = props => {
        if ( this.state.showingInfoWindow ) {
            this.setState( {
                showingInfoWindow: false,
                activeMarker: null
            } );
        }
    };

    render () {

        var bounds = new this.props.google.maps.LatLngBounds();
        for ( var i = 0; i < this.props.latlongs.length; i++ ) {
            if ( this.props.latlongs[ i ].lat && this.props.latlongs[ i ].lng ) {
                bounds.extend( { lat: this.props.latlongs[ i ].lat, lng: this.props.latlongs[ i ].lng } );
            }
        }
        return (
            <div>
                <Map
                    google={ this.props.google }
                    // zoom={ 14 }
                    initialCenter={
                        {
                            lat: 37.335480,
                            lng: -121.893028
                        }
                    }
                    bounds={ bounds }
                >
                    { this.props.latlongs.map( ( latlong, index ) => {
                        return <Marker
                            onClick={ this.onMarkerClick }
                            name={ latlong.name }
                            key={ index }
                            position={ { lat: latlong.lat, lng: latlong.lng } }
                        />
                    } ) }
                    <InfoWindow
                        marker={ this.state.activeMarker }
                        visible={ this.state.showingInfoWindow }
                        onClose={ this.onClose }
                    >
                        <div>
                            <h6>{ this.state.selectedPlace.name }</h6>
                        </div>
                    </InfoWindow></Map>
            </div>
        )
    }
}

export default GoogleApiWrapper( {
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY
} )( Maps );