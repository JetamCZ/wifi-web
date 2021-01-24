import React from "react"
import L from "leaflet"
import PropTypes from "prop-types"
import VectorMath from "../../../utils/VectorMath";
import moveIcon from "./icons/moveIcon";

class VectorSelect extends React.Component {
    constructor(props) {
        super(props)
        this.map = null

        this.markers = {

        }

        this.points = VectorMath.switchXY(this.props.polygon).map(p => {return {id: Math.random(), pos: p}})

        this.initInt = setInterval(this.init.bind(this), 100)

        this.addPointSpots = []
    }

    init() {
        if (this.context && this.props?.mapRef?.current?.map) {
            clearInterval(this.initInt)

            this.map = this.props.mapRef.current.map

            this.polygon = L.polygon(this.points.map(p => p.pos), {
                color: "#32d893"
            }).addTo(this.map);

            this.points.forEach((point, index) => {
                this.addDrag(point)
            })

            this.drawAddPointPosts()
        }
    }

    addDrag = (point) => {
        this.markers[point.id] = L.marker(point.pos, {
            draggable: true,
            icon: moveIcon
        }).addTo(this.map)

        this.markers[point.id].on('drag', (e) => this.handleMove(point.id, e))
        this.markers[point.id].on('click', (e) => this.deletePoint(point.id))
    }

    addPoint = (pointBefore, pos) => {
        const newPoints = [...this.points]
        const index = this.points.findIndex(p => p.id === pointBefore.id)

        const newPoint = {id: Math.random(), pos}

        newPoints.splice(index+1, 0, newPoint)

        this.addDrag(newPoint)

        this.points = newPoints
        this.draw()
    }

    deletePoint = (id) => {
        if(this.points.length < 4) {
            return
        }

        this.markers[id].removeFrom(this.map)

        this.points = this.points.filter(p => p.id !== id)
        this.draw()
    }

    handleMove = (id, e) => {
        const newPoints = [...this.points]

        const point = newPoints.find(p => p.id === id)
        point.pos = [e.latlng.lat, e.latlng.lng]

        this.points = newPoints

        this.draw()

        if(this.props.onChange) {
            this.props.onChange({
                f: this.props.mapRef.current.state.layerIndex,
                polygon: VectorMath.switchXY(this.points.map(p => p.pos))
            })
        }
    }

    draw = () => {
        this.polygon.setLatLngs(this.points.map(p => p.pos))

        this.drawAddPointPosts()
    }

    drawAddPointPosts = () => {
        for (const p of this.addPointSpots) {
            p.removeFrom(this.map)
        }

        this.addPointSpots = []

        this.points.forEach((point, index) => {
            const eI = (this.points.length-1) < (index+1) ? 0 : (index+1)
            const endP = this.points[eI]

            const middle = VectorMath.getMiddle(point.pos, endP.pos)

            const marker = L.circleMarker(middle,{
                color: "#32d893",
                radius: 8
            }).addTo(this.map)

            marker.on('click', () => this.addPoint(point, middle))

            this.addPointSpots.push(marker)
        })
    }

    render() {
        return <></>
    }
}

VectorSelect.propTypes = {
    mapRef: PropTypes.object.isRequired,
    polygon: PropTypes.array.isRequired,
    onChange: PropTypes.func
}

export default VectorSelect
