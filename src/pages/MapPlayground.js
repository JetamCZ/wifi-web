import React, {createRef} from "react";
import Map from "./maps/plans/Map";

const MapPlayground = () => {
    const mapRef = createRef()

    function calc2(circle1, circle2) {
        const c = Math.sqrt(Math.pow((circle1[0] - circle2[0]), 2) + Math.pow((circle1[1] - circle2[1]), 2))
        const d = (Math.pow(circle1[2], 2) + Math.pow(c, 2) - Math.pow(circle2[2], 2)) / (2 * c)
        const h = Math.sqrt(Math.pow(circle1[2], 2) - Math.pow(d, 2))

        return [
            [
                (circle2[0] - circle1[0]) * d / c + (circle2[1] - circle1[1]) * h / c + circle1[0],
                (circle2[1] - circle1[1]) * d / c - (circle2[0] - circle1[0]) * h / c + circle1[1]
            ],
            [
                (circle2[0] - circle1[0]) * d / c - (circle2[1] - circle1[1]) * h / c + circle1[0],
                (circle2[1] - circle1[1]) * d / c + (circle2[0] - circle1[0]) * h / c + circle1[1]
            ]
        ]
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

            </Map>
        </div>
    )
}

export default MapPlayground