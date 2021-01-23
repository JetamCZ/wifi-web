import React from "react"
import L from "leaflet"
import PropTypes from "prop-types"
import jsxToString from "jsx-to-string"
import otherIcon from "./icons/otherIcon"

class Marker extends React.Component {
    constructor(props) {
        super(props)

        this.initInt = setInterval(this.init.bind(this), 100)
        this.showHideInt = undefined

        this.marker = null
        this.map = null
        this.oms = null

        this.oldLayer = null
    }

    init() {
        if (this.context && this.props?.mapRef?.current?.map && this.props?.mapRef?.current?.oms) {
            clearInterval(this.initInt)

            this.map = this.props.mapRef.current.map
            this.oms = this.props.mapRef.current.oms

            this.marker = L.marker([this.props.pos[1], this.props.pos[0]], {
                icon: this.props.icon || otherIcon,
                draggable: this.props.draggable ?? false
            })

            if (this.props.dragend) {
                this.marker.on("dragend", this.props.dragend)
            }

            if (this.props.onClick) {
                this.marker.on("click", this.props.onClick)
            }

            if (this.props.children) {
                const popup = jsxToString(this.props.children).replaceAll("className=", "class=")

                this.marker.bindPopup(popup)
            }

            this.oms.addMarker(this.marker)

            this.showHideInt = setInterval(this.showHideByLayer.bind(this), 100)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.marker) {
            this.marker.setLatLng([this.props.pos[1], this.props.pos[0]])
            this.oldLayer = null
        }
    }

    showHideByLayer = () => {
        const layer = this.props.mapRef.current.state.layerIndex

        if (layer !== this.oldLayer) {
            if (this.props.pos[2] === layer) {
                this.map.addLayer(this.marker)
            } else {
                this.map.removeLayer(this.marker)
            }
        }

        this.oldLayer = layer
    }

    componentWillUnmount() {
        this.initInt && clearInterval(this.initInt)
        this.showHideInt && clearInterval(this.showHideInt)
    }

    render() {
        return <></>
    }
}

Marker.propTypes = {
    mapRef: PropTypes.object.isRequired,
    pos: PropTypes.array.isRequired.isRequired,
    children: PropTypes.element,
    icon: PropTypes.object,
    draggable: PropTypes.bool,
    dragend: PropTypes.func,
    onClick: PropTypes.func
}

export default Marker
