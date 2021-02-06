import React from "react"
import L from "leaflet"
import "overlapping-marker-spiderfier-leaflet/dist/oms"

const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier

class Map extends React.Component {
    constructor(props) {
        super(props)

        this.id = "map-" + Math.floor(Math.random() * 10000)

        this.state = {
            layerIndex: 0
        }

        this.map = null
        this.oms = null
        this.layerControl = null
    }

    getImageSize(image) {
        return new Promise(async (resolve) => {
            const img = new Image()
            img.onload = () => {
                resolve([img.height, img.width])
            }
            img.src = image
        })
    }

    setLayer(index) {
        const allControlElements = document.getElementsByClassName("leaflet-control-layers")

        const layerControlElement = allControlElements[allControlElements.length - 1]

        if (layerControlElement.getElementsByTagName("input")[index]) {
            layerControlElement.getElementsByTagName("input")[index].click()
        }

        this.setState({ layerIndex: index })
    }

    componentDidMount() {
        new Promise(async (resolve) => {
            this.map = L.map(this.id, {
                crs: L.CRS.Simple,
                minZoom: -5,
                preferCanvas: true
            })

            this.oms = new OverlappingMarkerSpiderfier(this.map, {
                keepSpiderfied: true
            })

            this.oms.addListener("spiderfy", (markers) => {
                this.map.closePopup()
            })

            this.layerControl = L.control.layers(this.overlays, {}).addTo(this.map)

            for (let i = 0; i < this.props.layers.length; i++) {
                const layer = this.props.layers[i]
                const bounds = [[0, 0], await this.getImageSize(layer.image)]

                const l = L.imageOverlay(layer.image, bounds)

                this.map.addLayer(l)
                this.layerControl.addBaseLayer(l, layer.name)
                this.setLayer(i)

                this.map.fitBounds(bounds)
            }

            this.map.on("baselayerchange", (change) => {
                const index = this.props.layers.map((l) => l.name).indexOf(change.name)
                this.setState({ layerIndex: index })
            })

            global.mapV = this.map

            resolve()
        }).then(() => {
            this.setLayer(0)
            this.props?.afterInit && this.props.afterInit(this.map)
        })
    }

    render() {
        return (
            <>
                <div className="map" id={this.id} style={{ height: this.props.height || "500px" }}></div>
                {this.props.children}
            </>
        )
    }
}

export default Map
