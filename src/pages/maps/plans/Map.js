import React from "react";
import Leaflet from "leaflet"
import jsxToString from 'jsx-to-string';

class Map extends React.Component{
    constructor(props) {
        super(props);

        this.id = 'map-'+Math.floor(Math.random()*10000)

        this.state = {
            layerIndex: 0
        }

        this.map = null
        this.layerControl = null

        this.markers = {}
    }

    getImageSize(image) {
        return new Promise(async (resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve([img.height, img.width])
            }
            img.src = image
        })
    }

    setLayer(index) {
        const layerControlElement = document.getElementsByClassName('leaflet-control-layers')[0];
        layerControlElement.getElementsByTagName('input')[index].click();

        this.cleanupMarkers()
        this.setState({layerIndex: index})
    }

    cleanupMarkers() {
        for (const marker in this.markers) {
            this.markers[marker].removeFrom(this.map)
        }

        this.markers = {}
    }

    componentDidMount() {
        new Promise((async (resolve) => {
            this.map = Leaflet.map(this.id, {
                crs: Leaflet.CRS.Simple,
                minZoom: -5,
                //preferCanvas: true
            })

            this.layerControl = Leaflet.control.layers(this.overlays, {}).addTo(this.map)

            for(let i = 0; i < this.props.layers.length ;i++) {
                const layer = this.props.layers[i]
                const bounds = [[0,0], await this.getImageSize(layer.image)]

                const l = Leaflet.imageOverlay(layer.image, bounds)

                this.map.addLayer(l)
                this.layerControl.addBaseLayer(l, layer.name)
                this.setLayer(i)

                this.map.fitBounds(bounds)
            }

            this.setMarkers()

            this.map.on('baselayerchange', (change) => {
                const index = this.props.layers.map(l => l.name).indexOf(change.name)
                this.setState({layerIndex: index})
                this.cleanupMarkers()
                this.setMarkers()
            })

            global.mapV = this.map

            resolve()
        }))
    }

    getMarkersDiff(oldMarkers, newMarkers) {
        const oldMakersIds = Object.keys(oldMarkers)
        const newMarkerIds = newMarkers.map(m => m.id)

        return {
            removed: oldMakersIds.filter(markerId => !newMarkerIds.includes(markerId)),
            new: newMarkerIds.filter(markerId => !oldMakersIds.includes(markerId)),
            same: newMarkerIds.filter(markerId => oldMakersIds.includes(markerId))
        }
    }

    setMarkers() {
        const layer = this.props.layers[this.state.layerIndex]

        const diff = this.getMarkersDiff(this.markers, layer.markers)

        diff.removed.forEach(markerId => {
            this.markers[markerId].removeFrom(this.map)
            delete this.markers[markerId]
        })

        for (let i = 0; i < layer.markers.length; i++) {
            const marker = layer.markers[i]

            const markersIds = Object.keys(this.markers)

            if(markersIds.includes(marker.id)) {
                this.markers[marker.id].setLatLng(marker.xy)

                if(!this.props.changingPos) {
                    this.markers[marker.id].setStyle({
                        radius: 6,
                        fillColor: marker.color,
                        fillOpacity: 1,
                        color: marker.color
                    })
                }
            } else {
                if(this.props.changingPos) {
                    this.markers[marker.id] = Leaflet.marker(marker.xy, {
                        draggable: true
                    }).addTo(this.map).on('dragend', (value) => {
                        marker.dragEnd(value)
                    })
                } else {
                    this.markers[marker.id] = Leaflet.circleMarker(marker.xy, {
                        radius: 6,
                        fillColor: marker.color,
                        fillOpacity: 1,
                        color: marker.color,
                        draggable: true
                    }).addTo(this.map)
                }

                if(marker.popup) {
                    const val = jsxToString(marker.popup).replaceAll('className=', 'class=')
                    this.markers[marker.id].bindPopup(val)
                }

                if(marker.clicked) {
                    this.markers[marker.id].on('click', (e) => marker.clicked(e))
                }
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.setMarkers();
    }

    render() {
        return (
            <>
                <div className="map" id={this.id} style={{height: this.props.height || "500px"}}></div>
            </>
        )
    }
}

export default Map