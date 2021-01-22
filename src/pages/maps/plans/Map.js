import React from "react";
import L from "leaflet";
import jsxToString from "jsx-to-string";
import "overlapping-marker-spiderfier-leaflet/dist/oms";
const OverlappingMarkerSpiderfier = window.OverlappingMarkerSpiderfier;

class Map extends React.Component {
  constructor(props) {
    super(props);

    this.id = "map-" + Math.floor(Math.random() * 10000);

    this.state = {
      layerIndex: 0,
    };

    this.map = null;
    this.oms = null;
    this.layerControl = null;

    this.markers = {};
  }

  getImageSize(image) {
    return new Promise(async (resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve([img.height, img.width]);
      };
      img.src = image;
    });
  }

  setLayer(index) {
    const allControlElements = document.getElementsByClassName(
      "leaflet-control-layers"
    );
    const layerControlElement =
      allControlElements[allControlElements.length - 1];
    layerControlElement.getElementsByTagName("input")[index].click();

    this.cleanupMarkers();
    this.setState({ layerIndex: index });
  }

  cleanupMarkers() {
    for (const marker in this.markers) {
      this.markers[marker].removeFrom(this.map);
    }

    this.markers = {};
  }

  componentDidMount() {
    new Promise(async (resolve) => {
      this.map = L.map(this.id, {
        crs: L.CRS.Simple,
        minZoom: -5,
        //preferCanvas: true
      });

      this.oms = new OverlappingMarkerSpiderfier(this.map, {
        keepSpiderfied: true,
      });

      this.oms.addListener("spiderfy", (markers) => {
        this.map.closePopup();
      });

      this.layerControl = L.control.layers(this.overlays, {}).addTo(this.map);

      for (let i = 0; i < this.props.layers.length; i++) {
        const layer = this.props.layers[i];
        const bounds = [[0, 0], await this.getImageSize(layer.image)];

        const l = L.imageOverlay(layer.image, bounds);

        this.map.addLayer(l);
        this.layerControl.addBaseLayer(l, layer.name);
        this.setLayer(i);

        this.map.fitBounds(bounds);
      }

      this.setMarkers();

      this.map.on("baselayerchange", (change) => {
        const index = this.props.layers.map((l) => l.name).indexOf(change.name);
        this.setState({ layerIndex: index });
        this.cleanupMarkers();
        this.setMarkers();
      });

      global.mapV = this.map;

      resolve();
    }).then(() => {
      this.setLayer(0);
    });
  }

  getMarkersDiff(oldMarkers, newMarkers) {
    const oldMakersIds = Object.keys(oldMarkers);
    const newMarkerIds = newMarkers.map((m) => m.id);

    return {
      removed: oldMakersIds.filter(
        (markerId) => !newMarkerIds.includes(markerId)
      ),
      new: newMarkerIds.filter((markerId) => !oldMakersIds.includes(markerId)),
      same: newMarkerIds.filter((markerId) => oldMakersIds.includes(markerId)),
    };
  }

  setMarkers() {
    const layer = this.props.layers[this.state.layerIndex];

    const diff = this.getMarkersDiff(this.markers, layer.markers);

    const beaconIcon = L.icon({
      iconUrl: "/img/pins/beacon-pin.png",
      shadowUrl: "/img/pins/beacon-shadow.png",

      iconSize: [32, 37], // size of the icon
      shadowSize: [72, 33], // size of the shadow
      iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
      shadowAnchor: [36, 32], // the same for the shadow
      popupAnchor: [0, -27], // point from which the popup should open relative to the iconAnchor
    });

    const deviceIcon = L.icon({
      iconUrl: "/img/pins/device-pin.png",
      shadowUrl: "/img/pins/device-shadow.png",

      iconSize: [32, 37], // size of the icon
      shadowSize: [72, 33], // size of the shadow
      iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
      shadowAnchor: [36, 32], // the same for the shadow
      popupAnchor: [0, -27], // point from which the popup should open relative to the iconAnchor
    });

    const otherIcon = L.icon({
      iconUrl: "/img/pins/other-pin.png",
      shadowUrl: "/img/pins/other-shadow.png",

      iconSize: [32, 37], // size of the icon
      shadowSize: [72, 33], // size of the shadow
      iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
      shadowAnchor: [36, 32], // the same for the shadow
      popupAnchor: [0, -27], // point from which the popup should open relative to the iconAnchor
    });

    const moveIcon = L.icon({
      iconUrl: "/img/pins/move-pin.png",
      shadowUrl: "/img/pins/move-shadow.png",

      iconSize: [32, 37], // size of the icon
      shadowSize: [72, 33], // size of the shadow
      iconAnchor: [16, 37], // point of the icon which will correspond to marker's location
      shadowAnchor: [36, 32], // the same for the shadow
      popupAnchor: [0, -27], // point from which the popup should open relative to the iconAnchor
    });

    diff.removed.forEach((markerId) => {
      this.markers[markerId].removeFrom(this.map);
      delete this.markers[markerId];
    });

    for (let i = 0; i < layer.markers.length; i++) {
      const marker = layer.markers[i];

      const markersIds = Object.keys(this.markers);

      if (markersIds.includes(marker.id)) {
        this.markers[marker.id].setLatLng(marker.xy);
      } else {
        let icon = otherIcon;
        switch (marker.type) {
          case "beacon":
            icon = beaconIcon;
            break;
          case "device":
            icon = deviceIcon;
            break;
          case "move":
            icon = moveIcon;
            break;
          default:
            icon = otherIcon;
            break;
        }

        this.markers[marker.id] = L.marker(marker.xy, {
          draggable: this.props.changingPos,
          icon: icon,
        });

        this.map.addLayer(this.markers[marker.id]);
        this.oms.addMarker(this.markers[marker.id]);

        if (this.props.changingPos) {
          this.markers[marker.id].on("dragend", (e) => marker.dragEnd(e));
        }

        if (marker.popup) {
          const val = jsxToString(marker.popup).replaceAll(
            "className=",
            "class="
          );
          this.markers[marker.id].bindPopup(val);
        }

        if (marker.clicked) {
          this.markers[marker.id].on("click", (e) => marker.clicked(e));
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.setMarkers();
  }

  render() {
    return (
      <>
        <div
          className="map"
          id={this.id}
          style={{ height: this.props.height || "500px" }}
        ></div>
      </>
    );
  }
}

export default Map;
