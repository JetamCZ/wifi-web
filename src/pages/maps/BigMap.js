import React from "react";
import Leaflet from "leaflet";
import AxiosInstance from "../../utils/AxiosInstance";
import Skeleton from '@material-ui/lab/Skeleton';
import Badge from '@material-ui/core/Badge';
import Format from "../../utils/formats"

class BigMap extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            oldData: null
        }

        this.init = false

        this.map = {
            beaconMarkers: [],
            devicesMarkers: []
        }

        this.updatingBeacons = {
            moving: null,
            lock: null
        }
    }

    componentDidMount() {
        this.mapView = Leaflet.map('leaflet', {crs: Leaflet.CRS.Simple})

        this.mapView.on({
            mousemove: (e) => {
                if(this.updateBeacons.moving) {
                    this.updateBeacons.moving.marker.setLatLng(e.latlng)
                }
            }
        })

        this.getUpdateData({
            updateBeacons: true
        })

        setInterval(() => this.getUpdateData({}), 5000)
    }

    beaconStopEdit(latlng) {
        const key = this.updateBeacons.moving.beacon.deviceKey

        this.updateBeacons.moving = null

        const beacons = [...this.state.data.beacons].map(b => {
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
        })
    }

    initBG(data) {
        this.init = true

        const img = new Image();
        img.onload = () => {
            const bounds = [[0,0], [img.width,img.height]];

            Leaflet.imageOverlay('/img/maps/1.png', bounds).addTo(this.mapView)

            this.mapView.fitBounds(bounds);
        }
        img.src = '/img/maps/1.png'
    }

    updateBeacons = (beacons) => {
        this.map.beaconMarkers.map((marker) => {
            marker.removeFrom(this.mapView)
        })

        const newBeacons = []
        beacons.map(b => {
            const marker = Leaflet.circleMarker([b.x, b.y], {
                radius: 6,
                color: "red",
                opacity: 0,
                fillOpacity: 0.5,
                fillColor: "red",
            })
                .on({click: (e) => {
                        if(!this.updateBeacons.lock && !this.updateBeacons.moving) {
                            this.updateBeacons.moving = {beacon: b, marker}
                        } else if(this.updateBeacons.moving) {
                            this.beaconStopEdit(e.latlng)
                        }
                    }})
                .bindTooltip('<b>'+b.name+'</b><br/>'+b.deviceKey, {
                    direction: 'top'
                }).openTooltip()
                .addTo(this.mapView)
        })

        this.map.beaconMarkers = newBeacons
    }

    updateDevices(devices) {
        this.map.devicesMarkers.forEach(marker => {
            marker.removeFrom(this.mapView)
        })

        const newMarkers = []

        devices.forEach(dev => {
            const marker = Leaflet.circleMarker([dev.pos.x, dev.pos.y], {
                radius: 4,
                color: "blue",
                opacity: 0,
                fillOpacity: 0.5,
                fillColor: "blue",
            })
                .bindTooltip(dev.name ? dev.name + '<br/>('+dev.mac+')' : dev.mac, {
                    permanent: true
                }).openTooltip()
                .addTo(this.mapView)

            newMarkers.push(marker)
        })


        this.map.devicesMarkers = newMarkers
    }

    getUpdateData(config) {
        const {updateBeacons} = config

        AxiosInstance.get('/maps/5faa4d34f27192296822c1eb')
            .then(res => {
                const allowedMacs = [
                    'e0:d0:83:d6:2a:57', //Matěj Telefon
                    '58:00:e3:ca:99:01', //Matěj NTB
                    '3c:dc:bc:97:f2:29', //Alenka mobil
                ]
                res.data.devices = res.data.devices.filter((dev) => {
                    return allowedMacs.includes(dev.mac)
                })

                this.setState({oldData: this.state.data, data: res.data})

                if(!this.init) {
                    this.initBG(res.data)
                }

                if(updateBeacons) {
                    this.updateBeacons(res.data.beacons)
                }

                this.updateDevices(res.data.devices)
            })
    }

    render() {
        const active = this.state.data ? this.state.data.beacons.filter((b) => Format.diffInSeconds(new Date(b.lastSeenDate)) < 30) : 0

        return (
            <div className="com-bigmap">
                <div id="leaflet"></div>
                <div className="info-box shadow">
                    <h1>{this.state.data ? this.state.data.name : <Skeleton animation="wave" width={100}/>}</h1>
                    {
                        this.state.data ? (
                            <div className="status">
                                <div className={active.length === this.state.data.beacons.length ? "item" : "item danger"}>
                                    {active.length}
                                    /{this.state.data.beacons.length} beacons active
                                </div>
                                <div className="item">{this.state.data.devices.length} active devices</div>
                            </div>
                        ) : (
                            <div className="status">
                                <Skeleton animation="wave" width={250}/>
                            </div>
                        )
                    }

                    {
                        active.length < 3 && this.state.data.devices.length === 0 && (
                            <div className="error">
                                <img src="/img/empty/sad-cloud.svg" alt=""/>
                                <div className="text">Could not find devices, to show device we need to have 3 active beacons!</div>
                            </div>
                        )
                    }

                    <div className="devices">
                        {
                            this.state.data ? this.state.data.devices.map(dev =>
                                <div className="device">
                                    <div className="name">
                                        {dev.name}
                                        <div className="mac">{dev.mac}</div>
                                    </div>
                                    <div className="date">
                                        {dev.vendor.substr(0, 20)}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="device">
                                        <div className="name">
                                            <Skeleton animation="wave" width={100}/>
                                            <div className="mac"><Skeleton animation="wave" width={150}/></div>
                                        </div>
                                        <div className="date">
                                            <Skeleton animation="wave" width={50}/>
                                        </div>
                                    </div>
                                    <div className="device">
                                        <div className="name">
                                            <Skeleton animation="wave" width={100}/>
                                            <div className="mac"><Skeleton animation="wave" width={150}/></div>
                                        </div>
                                        <div className="date">
                                            <Skeleton animation="wave" width={50}/>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default BigMap