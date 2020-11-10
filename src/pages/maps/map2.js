import React, {useContext} from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import Text from "../../components/Text";
import Leaflet from "leaflet";
import AxiosInstance from "../../utils/AxiosInstance";
import {StatusBarContext} from "../../contexts/StatusBarProvider";

class Map2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mapData: null,
            lock: false,
            moving: null
        }

        this.beacons = []
    }

    componentDidMount() {
        this.mapView = Leaflet.map('map-leaflet-2', {crs: Leaflet.CRS.Simple})
        this.mapView.on({
            mousemove: (e) => {
                if(this.state.moving) {
                    this.state.moving.marker.setLatLng(e.latlng)
                }
            }
        })

        this.update({
            init: true,
            updateBeacons: true
        })

        setInterval(() => this.update({updateBeacons: false}), 3000)
    }

    update(config) {
        AxiosInstance.get('/maps/5faa4d34f27192296822c1eb')
            .then(res => {
                this.setState({mapData: res.data})
                this.updateMap(config)
            })
    }

    updateMap(config) {
        const {init, updateBeacons} = config

        if(init) {
            const img = new Image();
            img.onload = () => {
                const bounds = [[0,0], [img.width,img.height]];

                Leaflet.imageOverlay('/img/maps/1.png', bounds).addTo(this.mapView)

                this.mapView.fitBounds(bounds);
            }
            img.src = '/img/maps/1.png'
        }

        if(updateBeacons) {
            this.beacons.map((beacon) => {
                beacon.removeFrom(this.mapView)
            })

            const newBeacons = []
            this.state.mapData.beacons.map(b => {
                const marker = Leaflet.circleMarker([b.x, b.y], {
                    radius: 4,
                    color: "red",
                    fillOpacity: 1,
                    fillColor: "red",
                })
                    .on({click: (e) => {
                        if(!this.state.lock && !this.state.moving) {
                            this.setState({moving: {beacon: b, marker}})
                        } else if(this.state.moving) {
                            this.saveBeaconMove(b.deviceKey, e.latlng)
                            this.setState({moving: null})

                        }
                    }})
                    .bindTooltip('<b>'+b.name+'</b><br/>'+b.deviceKey, {
                        direction: 'top'
                    }).openTooltip()
                    .addTo(this.mapView)
            })

            this.beacons = newBeacons

        }
    }

    saveBeaconMove(key, latlng) {
        console.log(key, latlng)

        const beacons = [...this.state.mapData.beacons].map(b => {
            delete b._id
            delete b.name

            if(b.deviceKey === key) {
                b.x = latlng.lat
                b.y = latlng.lng
            }

            return b
        })

        AxiosInstance.put('/maps/5faa4d34f27192296822c1eb', {
            beacons
        }).then(res => {
            console.log(res)
        })
    }

    render() {
        return (
            <div className="page-map w-page-1">
                {
                    this.state.mapData && (
                        <>
                            <Breadcrumbs items={[
                                {href: "/maps", item: <Text id="menu.maps">Maps</Text>},
                                {href: "/map/", item: this.state.mapData.name}
                            ]}/>
                        </>
                    )
                }

                <div id="map-leaflet-2">

                </div>
            </div>
        )
    }
}

export default Map2