import React from "react"
import L from "leaflet"
import PropTypes from "prop-types"
import jsxToString from "jsx-to-string"
import moveIcon from "./icons/moveIcon"

class Circle extends React.Component {
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

            this.marker = L.circle([this.props.pos[1], this.props.pos[0]], {
                radius: this.props.radius,
                fillColor: this.props.color ?? "#32d893",
                color: this.props.color ?? "#32d893"
            })


            this.map.addLayer(this.marker)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.marker) {
            this.marker.setLatLng([this.props.pos[1], this.props.pos[0]])
            this.marker.setRadius(this.props.radius)
        }
    }

    componentWillUnmount() {
        this.initInt && clearInterval(this.initInt)

        this.map.removeLayer(this.marker)
    }

    render() {
        return <></>
    }
}

Circle.propTypes = {
    mapRef: PropTypes.object.isRequired,
    pos: PropTypes.array.isRequired,
    radius: PropTypes.number.isRequired
}

export default Circle
