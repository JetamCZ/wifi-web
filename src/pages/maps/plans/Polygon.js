import React from "react"
import L from "leaflet"
import PropTypes from "prop-types"
import jsxToString from "jsx-to-string"
import VectorMath from "../../../utils/VectorMath";

class Polygon extends React.Component {
    constructor(props) {
        super(props)

        this.initInt = setInterval(this.init.bind(this), 100)
        this.showHideInt = undefined

        this.polygon = null
        this.map = null

        this.oldLayer = null
    }

    init() {
        if (this.context && this.props?.mapRef?.current?.map && this.props?.mapRef?.current?.oms) {
            clearInterval(this.initInt)

            this.map = this.props.mapRef.current.map

            this.polygon = L.polygon(VectorMath.switchXY(this.props.polygon), {
                color: this.props.color ?? undefined
            })

            if (this.props.onClick) {
                this.polygon.on("click", this.props.onClick)
            }

            if (this.props.children) {
                const popup = jsxToString(this.props.children).replaceAll("className=", "class=")

                this.polygon.bindPopup(popup)
            }

            this.showHideInt = setInterval(this.showHideByLayer.bind(this), 100)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.marker) {
            this.polygon.setLatLngs(VectorMath.switchXY(this.props.polygon))
            this.oldLayer = null
        }
    }

    showHideByLayer = () => {
        const layer = this.props.mapRef.current.state.layerIndex

        if (layer !== this.oldLayer) {
            if (this.props.f === layer) {
                this.polygon.addTo(this.map)
            } else {
                this.polygon.removeFrom(this.map)
            }
        }

        this.oldLayer = layer
    }

    componentWillUnmount() {
        this.initInt && clearInterval(this.initInt)
        this.showHideInt && clearInterval(this.showHideInt)

        this.polygon.removeFrom(this.map)
    }

    render() {
        return <></>
    }
}

Polygon.propTypes = {
    mapRef: PropTypes.object.isRequired,
    polygon: PropTypes.array.isRequired,
    f: PropTypes.number.isRequired,
    children: PropTypes.element,
    onClick: PropTypes.func,
    color: PropTypes.string
}

export default Polygon
