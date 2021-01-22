import React from "react";
import Leaflet from "leaflet";
import AxiosInstance from "../../utils/AxiosInstance";
import Skeleton from "@material-ui/lab/Skeleton";
import Badge from "@material-ui/core/Badge";
import Format from "../../utils/formats";
import { withRouter } from "react-router";

const printState = {
  OFF: 0,
  SETTINGS_LAT_LON: 1,
  GETTING_DATA: 2,
  SAVING: 3,
};

class BigMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      oldData: null,
      pa: null,
      print: {
        state: printState.OFF,
        marker: null,
        dev: {
          mac: null,
          name: null,
        },
        x: 0,
        y: 0,
        p: 0,
      },
    };

    this.init = false;

    this.map = {
      beaconMarkers: [],
      devicesMarkers: [],
    };

    this.updatingBeacons = {
      moving: null,
      lock: false,
    };

    this.p = {};

    this.id = props.match.params.id;
  }

  startPrint(dev) {
    const lg = dev.pos ? [dev.pos.x, dev.pos.y] : [0, 0];

    const marker = Leaflet.marker(lg, {
      draggable: true,
    })
      .on("dragend", (e) => {
        const n = { ...this.state.print };
        n.x = Math.round(e.target._latlng.lat);
        n.y = Math.round(e.target._latlng.lng);

        this.setState({
          print: n,
        });
      })
      .addTo(this.mapView);

    this.setState({
      print: {
        ...this.state.print,
        dev,
        state: printState.SETTINGS_LAT_LON,
        marker,
        x: lg[0],
        y: lg[1],
        p: this.state.pa,
        d: null,
      },
    });
  }

  printSetLatLng() {
    this.state.print.marker.removeFrom(this.mapView);

    this.setState({
      print: {
        ...this.state.print,
        state: printState.GETTING_DATA,
        d: new Date(),
      },
    });
  }

  printSave(lastSeens) {
    this.setState({ print: { ...this.state.print, state: printState.SAVING } });

    AxiosInstance.put("/maps/" + this.id, {
      pos: {
        x: this.state.print.x,
        y: this.state.print.y,
        p: this.state.print.p,
      },
      beacons: [
        ...lastSeens.map((ls) => {
          delete ls._id;
          delete ls.date;
          delete ls.deviceId;
          return ls;
        }),
      ],
    }).then(() => {
      this.setState({ print: { ...this.state.print, state: printState.OFF } });
    });
  }

  componentDidMount() {
    this.getUpdateData({
      updateBeacons: true,
    });

    setInterval(() => this.getUpdateData({}), 5000);
  }

  beaconStopEdit(latlng) {
    const key = this.updatingBeacons.moving.beacon.deviceKey;

    this.updatingBeacons.moving = null;

    const beacons = [...this.state.data.beacons].map((b) => {
      delete b._id;
      delete b.name;

      if (b.deviceKey === key) {
        b.x = latlng.lat;
        b.y = latlng.lng;
      }

      return b;
    });

    AxiosInstance.patch("/maps/" + this.id, {
      beacons,
    });
  }

  initBG(data) {
    this.init = true;

    this.mapView = Leaflet.map("leaflet", {
      crs: Leaflet.CRS.Simple,
      layers: [],
    });

    this.mapView.on({
      mousemove: (e) => {
        if (this.updatingBeacons.moving) {
          this.updatingBeacons.moving.marker.setLatLng(e.latlng);
        }
      },
    });

    this.setState({ pa: data.layers[0].p });

    data.layers.forEach((layer, index) => {
      const img = new Image();
      img.onload = () => {
        const bounds = [
          [0, 0],
          [img.height, img.width],
        ];

        this.p[layer.p] = Leaflet.imageOverlay(img.src, bounds);

        if (this.state.pa === layer.p) {
          this.p[layer.p].addTo(this.mapView);
          this.mapView.fitBounds(bounds);
        }
      };
      img.src = "/img/maps/" + layer.image;
    });
  }

  showP = (n) => {
    this.p[this.state.pa].removeFrom(this.mapView);
    this.p[n].addTo(this.mapView);
    this.setState({ pa: n });

    this.getUpdateData({
      updateBeacons: true,
    });
  };

  updateBeacons = (beacons) => {
    beacons = beacons.filter((b) => b.p === this.state.pa);

    this.map.beaconMarkers.map((marker) => {
      marker.removeFrom(this.mapView);
    });

    const newBeacons = [];
    beacons.map((b) => {
      const marker = Leaflet.circleMarker([b.x, b.y], {
        radius: 6,
        color: "red",
        opacity: 0,
        fillOpacity: 0.5,
        fillColor: "red",
      })
        .on({
          click: (e) => {
            if (!this.updatingBeacons.lock && !this.updatingBeacons.moving) {
              this.updatingBeacons.moving = { beacon: b, marker };
            } else if (this.updatingBeacons.moving) {
              this.beaconStopEdit(e.latlng);
            }
          },
        })
        .bindTooltip("<b>" + b.name + "</b><br/>" + b.deviceKey, {
          direction: "top",
        })
        .openTooltip()
        .addTo(this.mapView);

      newBeacons.push(marker);
    });

    this.map.beaconMarkers = newBeacons;
  };

  updateDevices(devices) {
    this.map.devicesMarkers.forEach((marker) => {
      marker.removeFrom(this.mapView);
    });

    devices = devices.filter(
      (dev) =>
        (dev.pos && dev.pos.p === "*") ||
        (dev.pos && dev.pos.p === this.state.pa)
    );

    const newMarkers = [];

    devices.forEach((dev) => {
      if (dev.pos) {
        const marker = Leaflet.circleMarker([dev.pos.x, dev.pos.y], {
          radius: 4,
          color: "blue",
          opacity: 0,
          fillOpacity: 0.5,
          fillColor: "blue",
        })
          .bindTooltip(
            dev.name ? dev.name + "<br/>(" + dev.mac + ")" : dev.mac,
            {
              permanent: true,
            }
          )
          .openTooltip()
          .addTo(this.mapView);

        newMarkers.push(marker);
      }
    });

    this.map.devicesMarkers = newMarkers;
  }

  getUpdateData(config) {
    const { updateBeacons } = config;

    AxiosInstance.get("/maps/" + this.id).then((res) => {
      const allowedMacs = [
        "e0:d0:83:d6:2a:57", //Matěj Telefon
        "58:00:e3:ca:99:01", //Matěj NTB
        //'3c:dc:bc:97:f2:29', //Alenka mobil
      ];

      res.data.devices = res.data.devices.filter((dev) => {
        return allowedMacs.includes(dev.mac);
      });

      if (this.state.print.state === printState.GETTING_DATA) {
        const d = res.data.devices.find(
          (d) => d.mac === this.state.print.dev.mac
        );

        if (d) {
          console.log(
            d.lastSeens,
            d.lastSeens.filter((ls) => new Date(ls.date) > this.state.print.d)
          );
        }

        if (
          d &&
          d.lastSeens.filter((ls) => new Date(ls.date) > this.state.print.d)
            .length >= res.data.beacons.length
        ) {
          this.printSave(d.lastSeens);
        }
      }

      this.setState({ oldData: this.state.data, data: res.data });

      if (!this.init) {
        this.initBG(res.data);
      }

      if (updateBeacons) {
        this.updateBeacons(res.data.beacons);
      }

      this.updateDevices(res.data.devices);
    });
  }

  render() {
    const active = this.state.data
      ? this.state.data.beacons.filter(
          (b) => Format.diffInSeconds(new Date(b.lastSeenDate)) < 30
        )
      : 0;

    return (
      <div className="com-bigmap">
        <div id="leaflet"></div>
        {this.state.print.state !== printState.OFF && (
          <div className="print">
            <h2>Zaznamenání polohy</h2>
            {this.state.print.state === printState.SETTINGS_LAT_LON && (
              <>
                <h4>Posuň bod na mapě na reálné umístění zařízení</h4>
                <p>
                  name: {this.state.print.dev.name} <br />
                  mac: {this.state.print.dev.mac} <br />
                  x: {this.state.print.x} y: {this.state.print.y} p:{" "}
                  {this.state.print.p}
                </p>
                <span
                  className="btn btn-light"
                  onClick={() => this.printSetLatLng()}
                >
                  Nastavit polohu
                </span>
                <span
                  className="btn btn-cancel"
                  onClick={() => {
                    this.setState({
                      print: {
                        ...this.state.print,
                        state: printState.OFF,
                      },
                    });
                    this.state.print.marker.removeFrom(this.mapView);
                  }}
                >
                  Zrušit
                </span>
              </>
            )}
            {this.state.print.state === printState.GETTING_DATA && (
              <>
                <h4>Získávám data RSSI, nehýbej se zařízením</h4>
                <span
                  className="btn btn-cancel"
                  onClick={() => {
                    this.setState({
                      print: {
                        ...this.state.print,
                        state: printState.OFF,
                      },
                    });
                    this.state.print.marker.removeFrom(this.mapView);
                  }}
                >
                  Zrušit
                </span>
              </>
            )}
            {this.state.print.state === printState.SAVING && (
              <>
                <h4>Odesílám záznam na server</h4>
                <span
                  className="btn btn-light"
                  onClick={() => this.printSetLatLng()}
                >
                  Nastavit polohu
                </span>
              </>
            )}
          </div>
        )}
        <div className="info-box shadow">
          <h1>
            {this.state.data ? (
              this.state.data.name
            ) : (
              <Skeleton animation="wave" width={100} />
            )}
          </h1>
          {this.state.data ? (
            <div className="status">
              <div
                className={
                  active.length === this.state.data.beacons.length
                    ? "item"
                    : "item danger"
                }
              >
                {active.length}/{this.state.data.beacons.length} beacons active
              </div>
              <div className="item">
                {this.state.data.devices.length} active devices
              </div>
            </div>
          ) : (
            <div className="status">
              <Skeleton animation="wave" width={250} />
            </div>
          )}

          <div className="plans">
            {this.state.data &&
              this.state.data.layers.map((p) => (
                <div
                  className={this.state.pa === p.p ? "plan selected" : "plan"}
                  onClick={() => this.showP(p.p)}
                >
                  {p.p}
                </div>
              ))}
          </div>

          {active.length < 3 && this.state.data.devices.length === 0 && (
            <div className="error">
              <img src="/img/empty/sad-cloud.svg" alt="" />
              <div className="text">
                Could not find devices, to show device we need to have 3 active
                beacons!
              </div>
            </div>
          )}

          <div className="devices">
            {this.state.data ? (
              this.state.data.devices.map((dev) => (
                <div className="device">
                  <div className="name">
                    {dev.name}
                    <div className="mac">{dev.mac}</div>
                  </div>
                  <div className="tools">
                    <div className="tool" onClick={() => this.startPrint(dev)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-map-pin"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="device">
                  <div className="name">
                    <Skeleton animation="wave" width={100} />
                    <div className="mac">
                      <Skeleton animation="wave" width={150} />
                    </div>
                  </div>
                  <div className="date">
                    <Skeleton animation="wave" width={50} />
                  </div>
                </div>
                <div className="device">
                  <div className="name">
                    <Skeleton animation="wave" width={100} />
                    <div className="mac">
                      <Skeleton animation="wave" width={150} />
                    </div>
                  </div>
                  <div className="date">
                    <Skeleton animation="wave" width={50} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BigMap);
