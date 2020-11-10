import React, {useEffect, useState} from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import Text from "../../components/Text";
import {Link} from "react-router-dom"
import trilateration from "node-trilateration"
import AxiosInstance from "../../utils/AxiosInstance";
import Leaflet from "leaflet"

const Map = () => {
    const [map, setMap] = useState(null)
    const [mapView, setMapView] = useState(null)

    const saveMap = () => {

    }

    const def = (data) => {
        console.log(this, mapView)
    }

    const update = (config) => {
        const {mapV, init, updateBeacons} = config

        AxiosInstance.get('/maps/5faa4d34f27192296822c1eb')
            .then((res) => {
                def(res.data)

                setMap(res.data)

                if(init) {
                    const img = new Image();
                    img.onload = function() {
                        const bounds = [[0,0], [this.width,this.height]];

                        Leaflet.imageOverlay('/img/maps/1.png', bounds).addTo(mapV)

                        mapV.fitBounds(bounds);
                    }
                    img.src = '/img/maps/1.png'
                }

                if(updateBeacons) {
                    global.beacons.map((beacon) => {
                        beacon.removeFrom(mapV)
                    })

                    const newBeacons = []
                    res.data.beacons.map(b => {
                        const marker = Leaflet.circleMarker([b.x, b.y], {
                            radius: 4,
                            color: "red",
                            fillOpacity: 1,
                            fillColor: "red",
                        })
                            .on({click: (e) => {console.log(e, b)}})
                            .bindTooltip('<b>'+b.name+'</b><br/>'+b.deviceKey, {
                                direction: 'top'
                            }).openTooltip()
                            .addTo(mapV)

                        newBeacons.push(marker)
                    })
                    global.beacons = newBeacons
                }

                /*
                const dev = []
                res.data.lastSeens.forEach((seen) => {
                    const posBeacon = map.beacons.find(b => b.key === seen.deviceKey)

                    const d = (-45.163 - seen.rssi)/1.3807

                    console.log(d)

                    dev.push({x: posBeacon.pos.x, y: posBeacon.pos.y, distance: seen.rssi*(-1)})
                })

                console.log(JSON.stringify(dev))

                const calcPos = trilateration.calculate(dev);

                setDevices([
                    {x: calcPos.x, y: calcPos.y, mac: "cc:2d:21:2f:16:41"}
                ])

                if(mapView) {
                    Leaflet.circleMarker([calcPos.x, calcPos.y], {
                        radius: 4,
                        color: "green",
                        fillOpacity: 1,
                        fillColor: "green",
                        permanent: true
                    }).bindPopup("my tooltip text").openPopup({

                    }).addTo(mapView)
                }

                 */
            })
    }

    useEffect(async () => {
        global.beacons = []

        const mapV = Leaflet.map('map-leaflet', {crs: Leaflet.CRS.Simple})
        mapV.on({
            mousemove: (e) => {
                //console.log(e.latlng)
            }
        })
        setMapView(mapV)

        const beaconsMarks = []

        update({
            mapV,
            init: true,
            updateBeacons: true
        },true, true)

        const interval = setInterval(() => update({
            mapV,
            init: false,
            updateBeacons: true
        }), 3000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className="page-map w-page-1">
            {
                map && (
                    <>
                        <Breadcrumbs items={[
                            {href: "/maps", item: <Text id="menu.maps">Maps</Text>},
                            {href: "/map/", item: map.name}
                        ]}/>
                    </>
                )
            }

            <div id="map-leaflet">

            </div>
        </div>
    )
}

export default Map