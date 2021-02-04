import React, {createRef, useEffect, useState} from "react";
import Map from "./maps/plans/Map";
import Marker from "./maps/plans/Marker";
import Circle from "./maps/plans/Circle";
import moveIcon from "./maps/plans/icons/moveIcon";
import PosSelect from "./maps/plans/PosSelect";
import deviceIcon from "./maps/plans/icons/deviceIcon";

const MapPlayground = () => {
    const mapRef = createRef()

    const [resPoint, setResPoint] = useState(null)
    const [d, setD] = useState(1)

    const data = [{"x":736,"y":48,"distance":50},{"x":896,"y":464,"distance":80},{"x":400,"y":808,"distance":94}]

    useEffect(() => {
        setResPoint(calc(1))
    }, [])

    function intersectionsOfTwoCircles(circle1, circle2) {
        const c = Math.sqrt(Math.pow((circle1[0] - circle2[0]), 2) + Math.pow((circle1[1] - circle2[1]), 2))
        const d = (Math.pow(circle1[2], 2) + Math.pow(c, 2) - Math.pow(circle2[2], 2)) / (2 * c)
        const h = Math.sqrt(Math.pow(circle1[2], 2) - Math.pow(d, 2))

        const points = [
            [
                (circle2[0] - circle1[0]) * d / c + (circle2[1] - circle1[1]) * h / c + circle1[0],
                (circle2[1] - circle1[1]) * d / c - (circle2[0] - circle1[0]) * h / c + circle1[1]
            ],
            [
                (circle2[0] - circle1[0]) * d / c - (circle2[1] - circle1[1]) * h / c + circle1[0],
                (circle2[1] - circle1[1]) * d / c + (circle2[0] - circle1[0]) * h / c + circle1[1]
            ]
        ]

        return points.filter(p => p[0] && p[1])
    }

    function isPointInCircle(circle, point) {
        return Math.sqrt(Math.pow(point[0]-circle[0], 2) + Math.pow(point[1]-circle[1], 2)) < circle[2]
    }

    const calc = (dx, maxDx = 50) => {
        if(data.length < 2) {
            return null
        }

        if(dx >= maxDx) {
            return null
        }

        const intersection = intersectionsOfTwoCircles(
            [data[0].x, data[0].y, data[0].distance*dx],
            [data[1].x, data[1].y, data[1].distance*dx]
        )

        if(intersection.length >= 2) {
            for(const point of intersection) {
                if(isPointInCircle([data[2].x, data[2].y, data[2].distance*dx], point)) {
                    return point
                }
            }
        }

        return calc(dx+0.1)
    }

    return (
        <div>
            <Map ref={mapRef}
                 afterInit={(map) => {
                 }} //Init map
                 layers={[
                     {
                         floor: 0,
                         image: "/img/white-grid.png",
                         name: "Podkladová mapa",
                     }
                 ]}
            >
                {
                    data.map(b => <>
                        <Marker mapRef={mapRef} pos={[b.x, b.y, 0]}/>
                        <Circle mapRef={mapRef} pos={[b.x, b.y]} radius={b.distance*d}/>
                    </>)
                }
                {
                    resPoint && (
                        <Marker mapRef={mapRef} pos={[...resPoint, 0]} icon={deviceIcon}/>
                    )
                }
            </Map>
        </div>
    )
}

export default MapPlayground