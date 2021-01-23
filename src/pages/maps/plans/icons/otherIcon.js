import L from "leaflet"

const otherIcon = L.icon({
    iconUrl: "/img/pins/other-pin.png",
    shadowUrl: "/img/pins/other-shadow.png",

    iconSize: [32, 37], // size of the icon
    shadowSize: [72, 33], // size of the shadow
    iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
    shadowAnchor: [36, 32], // the same for the shadow
    popupAnchor: [0, -27] // point from which the popup should open relative to the iconAnchor
})

export default otherIcon
