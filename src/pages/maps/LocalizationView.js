import React, { useEffect, useRef, useState } from "react"
import AxiosInstance from "../../utils/AxiosInstance"
import T from "../../components/T"
import Map from "./plans/Map"
import { useParams } from "react-router-dom"
import Modal from "../../components/Modal"
import ChangeBeaconsPos from "./ChangeBeaconPos"
import MakeFingerPrint from "./MakeFingerPrint"
import { useHistory } from "react-router-dom"
import Marker from "./plans/Marker"
import beaconIcon from "./plans/icons/beaconIncon"
import deviceIcon from "./plans/icons/deviceIcon"
import L from "leaflet"
import "leaflet-easybutton"
import "leaflet-easybutton/src/easy-button.css"

const LocalizationView = () => {
    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2,
        DELETED: 3
    }

    const [state, setState] = useState(states.LOADING)
    const [data, setData] = useState(null)

    const { id } = useParams()

    const changeBeaconsPosModal = useRef()
    const setFingerPrintModal = useRef()
    const deleteModal = useRef()

    const history = useHistory()
    const map = useRef()

    useEffect(() => {
        update()
        const interval = setInterval(update, 5000)

        /*
    const socket = io(config.socketServer);

    socket.on("handshake", () => {
      socket.emit("auth", {
        token: UserController.getToken(),
        localizationId: id,
      });
    });

    socket.on("update", (data) => {
      setData(data);
    });

     */

        return function cleanup() {
            clearInterval(interval)
            //socket.disconnect();
        }
    }, [])

    const update = () => {
        AxiosInstance.get("/localization/" + id)
            .then((res) => {
                setData(res.data)
                setState(states.DONE)
            })
            .catch(() => {
                //setState(states.ERROR)
            })
    }

    const getLayers = (d) => {
        const layers = { ...d }.floors

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i]

            layer.markers = []

            delete layer._id
            //delete layer.floor
        }

        return layers
    }

    return (
        <div className="container">
            {state === states.LOADING && (
                <h2>
                    <T id="loading" />
                </h2>
            )}

            {data && state === states.DONE && (
                <>
                    <h1 className="name">{data.name}</h1>

                    <div className="summary">
                        <div className="item">
                            <div className="title">Typ lokalizace:</div>
                            <div className="value">{data.type}</div>
                        </div>
                        <div className="item">
                            <div className="title">Plán:</div>
                            <div className="value">{data.plan.name}</div>
                        </div>
                        <div className="item">
                            <div className="title">Počet majáků:</div>
                            <div className="value">{data.beacons.length}</div>
                        </div>
                    </div>

                    <Map
                        layers={getLayers(data.plan)}
                        ref={map}
                        afterInit={(remap) => {
                            ;["NEAREST_FINGERPRINT"].includes(data.type) &&
                                L.easyButton(
                                    '<img src="/img/icons/crosshair.svg" alt="Make fingerprint" />',
                                    () => {
                                        setFingerPrintModal.current.open()
                                    },
                                    "Make new fingerprint"
                                ).addTo(remap)
                            ;["NEAREST_FINGERPRINT"].includes(data.type) &&
                                L.easyButton(
                                    '<img src="/img/icons/edit.svg" alt="Edit position of beacons" />',
                                    () => {
                                        changeBeaconsPosModal.current.open()
                                    },
                                    "Edit beacons positions"
                                ).addTo(remap)
                        }}
                    >
                        <>
                            {data.beacons.map((beacon) => (
                                <Marker
                                    key={beacon._id}
                                    pos={[beacon.x, beacon.y, beacon.f]}
                                    icon={beaconIcon}
                                    mapRef={map}
                                    beacon={beacon}
                                >
                                    <div className="mini-beaconView">
                                        <div className="title">
                                            <div className="name">{beacon.name}</div>
                                            <div className="key">{beacon.deviceKey}</div>
                                            <br />
                                            <div className="summary-title">Popis umístění:</div>
                                            <p>{beacon.desc ?? "..."}</p>
                                        </div>
                                    </div>
                                </Marker>
                            ))}
                            {data.devices.map((device) => (
                                <Marker
                                    key={device.mac}
                                    pos={[device.x, device.y, device.f]}
                                    icon={deviceIcon}
                                    mapRef={map}
                                >
                                    <div className="mini-deviceView">
                                        <div className="title">
                                            <div className="name">{device.name}</div>
                                            <div className="key">{device.mac}</div>
                                        </div>
                                    </div>
                                </Marker>
                            ))}
                        </>
                    </Map>

                    <div className="tools">
                        <div
                            className="item"
                            onClick={() => {
                                deleteModal.current.open()
                            }}
                        >
                            <img src={"/img/icons/trash.svg"} alt="Trash icon" />
                            Odebrat lokalizaci
                        </div>
                    </div>

                    {data.type === "NEAREST_FINGERPRINT" &&
                        data.beacons.filter((b) => b.x === 0 && b.y === 0 && b.f === 0).length ===
                            data.beacons.length && (
                            <div className="step-info">
                                Zvol nástroj <i>Editovat pozice majáků</i> a rozmisť majáky na mapě!
                            </div>
                        )}

                    {data.type === "WALDO" && (
                        <div className="step-info">
                            <img src="/img/waldo/waldo.jpg" alt="" height={80} style={{ marginRight: "20px" }} />
                            Where's Wally? / Where is Waldo - je hra, kde je cílem na obrázku Walda najít! Tato
                            lokalizace byla přidána automaticky po nalezení easter eggu!
                        </div>
                    )}

                    <div className="gap h-2"></div>

                    <div className="table-wrapper">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Název</th>
                                    <th>Poschodí</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.devices.map((device) => (
                                    <tr key={device.mac}>
                                        <td>
                                            <div className="two-line">
                                                <div className="line">{device.name}</div>
                                                <div className="line light">{device.mac}</div>
                                            </div>
                                        </td>
                                        <td>{device.f}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Modal ref={changeBeaconsPosModal}>
                        <ChangeBeaconsPos
                            id={id}
                            afterSave={() => {
                                changeBeaconsPosModal.current.close()
                                update()
                            }}
                        />
                    </Modal>

                    <Modal ref={setFingerPrintModal}>
                        <MakeFingerPrint
                            id={id}
                            afterSave={() => {
                                setFingerPrintModal.current.close()
                                update()
                            }}
                        />
                    </Modal>

                    <Modal ref={deleteModal}>
                        <h1>Přejete si smazat tuto lokalizaci?</h1>
                        <p>Tato akce je nevratná a ztratíte veškeré fingerprinty.</p>

                        <br />
                        <br />

                        <div
                            className="btn danger"
                            onClick={() => {
                                AxiosInstance.delete("/localization/" + id).then(() => {
                                    deleteModal.current.close()
                                    history.push("/maps")
                                })
                            }}
                        >
                            Ano, smazat
                        </div>
                        <div className="btn" onClick={() => deleteModal.current.close()}>
                            Ponechat
                        </div>
                    </Modal>
                </>
            )}

            {state === states.ERROR && (
                <h1>
                    <T id="error" />
                </h1>
            )}

            {state === states.DELETED && (
                <h1>
                    <T id="viewBeacon.deleted" />
                </h1>
            )}
        </div>
    )
}

export default LocalizationView
