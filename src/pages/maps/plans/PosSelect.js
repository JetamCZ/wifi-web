import React from "react"
import L from "leaflet"
import PropTypes from "prop-types"
import jsxToString from "jsx-to-string"
import moveIcon from "./icons/moveIcon"

class PosSelect extends React.Component {
    constructor(props) {
        super(props)

        this.initInt = setInterval(this.init.bind(this), 100)

        this.marker = null
        this.map = null
    }

    init() {
        if (this.context && this.props?.mapRef?.current?.map) {
            clearInterval(this.initInt)

            this.map = this.props.mapRef.current.map

            this.marker = L.marker([this.props.pos[1], this.props.pos[0]], {
                icon: moveIcon,
                draggable: true,
            })

            this.marker.on("dragend", this.onChange.bind(this))

            this.map.addLayer(this.marker)
        }
    }

    onChange(e) {
        const layer = this.props.mapRef.current.state.layerIndex

        this.props.onChange([e.target._latlng.lng, e.target._latlng.lat, layer])
    }

    componentWillUnmount() {
        this.initInt && clearInterval(this.initInt)

        this.map.removeLayer(this.marker)
    }

    render() {
        return <></>
    }
}

PosSelect.propTypes = {
    mapRef: PropTypes.object.isRequired,
    pos: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
}

export default PosSelect
