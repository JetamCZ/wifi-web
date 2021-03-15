import React, { useEffect, useRef, useState } from "react"
import AxiosInstance from "../../utils/AxiosInstance"
import T from "../../components/T"
import Map from "./plans/Map"
import { useParams } from "react-router-dom"
import Modal from "../../components/Modal"
import ChangeBeaconsPos from "./ChangeBeaconPos"
import MakeFingerPrint from "./MakeFingerPrint"
import Marker from "./plans/Marker"
import beaconIcon from "./plans/icons/beaconIncon"
import deviceIcon from "./plans/icons/deviceIcon"
import L from "leaflet"
import "leaflet-easybutton"
import "leaflet-easybutton/src/easy-button.css"
import DeleteModal from "./LocalizationView/DeleteModal"
import Polygon from "./plans/Polygon"
import EditRoomModal from "./LocalizationView/EditRoomsModal"
import BlueLayout from "../../layouts/BlueLayout"
import formats from "../../utils/formats"
import io from "socket.io-client"
import config from "../../config"
import UserController from "../../controllers/UserController"
import TimeLine from "../history/components/TimeLine";
import Circle from "./plans/Circle";

const LocalizationView = () => {
    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2,
        DELETED: 3
    }

    const [state, setState] = useState(states.LOADING)
    const [data, setData] = useState(null)
    const [showRooms, setShowRooms] = useState(false)


    const [timeData, setTimeData] = useState(null)

    const { id } = useParams()

    const changeBeaconsPosModal = useRef()
    const setFingerPrintModal = useRef()
    const deleteModal = useRef()
    const editRoomsModal = useRef()

    const map = useRef()

    useEffect(() => {
        update()
        const interval = setInterval(update, 3*1000)

        const socket = io(config.socketServer)

        global.d = 12

        socket.on("handshake", () => {
            socket.emit("auth", {
                token: UserController.getToken(),
                localizationId: id
            })
        })

        socket.on("update", (data) => {
            setData(data)
        })

        updateHistoryData()
        const intHistory = setInterval(updateHistoryData, 30*1000)


        return function cleanup() {
            clearInterval(interval)
            clearInterval(intHistory)
            //socket.disconnect();
        }
    }, [])

    const updateHistoryData = () => {
        AxiosInstance.get('/history/localization/'+id)
            .then((res) => setTimeData(res.data))
            .catch((e) => {})
    }

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

    if (state === states.ERROR) {
        return (
            <div className="container">
                <h1>
                    <T id="error" />
                </h1>
            </div>
        )
    }

    if (state === states.DELETED) {
        return (
            <div className="container">
                <h1>
                    <T id="viewBeacon.deleted" />
                </h1>
            </div>
        )
    }

    if (state === states.LOADING) {
        return (
            <div className="container">
                <h1>
                    <T id="loading" />
                </h1>
            </div>
        )
    }

    return (
        <BlueLayout title={data && state === states.DONE ? data.name : "Načítání..."}>
            <div className="container">
                {data && state === states.DONE && (
                    <>
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
                            {
                                data?.customLocalizationData?.fingerPrintsCount >= 0 && (
                                    <div className="item">
                                        <div className="title">Počet fingerprintů:</div>
                                        <div className="value">{data?.customLocalizationData?.fingerPrintsCount}</div>
                                    </div>
                                )
                            }
                        </div>
                        <Map
                            layers={getLayers(data.plan)}
                            ref={map}
                            afterInit={(remap) => {
                                if (["NEAREST_FINGERPRINT", "BRAIN"].includes(data.type)) {
                                    L.easyButton(
                                        '<img src="/img/icons/crosshair-add.svg" alt="Make fingerprint" />',
                                        () => {
                                            setFingerPrintModal.current.open()
                                        },
                                        "Make new fingerprint"
                                    ).addTo(remap)
                                }

                                if (["NEAREST_FINGERPRINT", "TRILATERATION", "BRAIN"].includes(data.type)) {
                                    L.easyButton(
                                        '<img src="/img/icons/wifi-edit.svg" alt="Edit position of beacons" />',
                                        () => {
                                            changeBeaconsPosModal.current.open()
                                        },
                                        "Edit beacons positions"
                                    ).addTo(remap)
                                }

                                if (["NEAREST_FINGERPRINT", "TRILATERATION", "BRAIN"].includes(data.type)) {
                                    L.easyButton(
                                        '<img src="/img/icons/home-edit.svg" alt="Edit Rooms" />',
                                        () => {
                                            editRoomsModal.current.open()
                                        },
                                        "edit rooms"
                                    ).addTo(remap)

                                    L.easyButton({
                                        states: [
                                            {
                                                stateName: "show",
                                                icon: '<img src="/img/icons/home-show.svg" alt="Show rooms" />',
                                                title: "Show rooms",
                                                onClick: (control) => {
                                                    setShowRooms(true)
                                                    control.state("hide")
                                                }
                                            },
                                            {
                                                stateName: "hide",
                                                icon: '<img src="/img/icons/home-hide.svg" alt="Hide rooms" />',
                                                title: "Hide rooms",
                                                onClick: (control) => {
                                                    setShowRooms(false)
                                                    control.state("show")
                                                }
                                            }
                                        ]
                                    }).addTo(remap)
                                }
                            }}
                        >
                            {data && map.current && (
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
                                    {showRooms &&
                                        data?.rooms.map((room) => (
                                            <Polygon key={room._id} mapRef={map} polygon={room.polygon} f={room.f} color={room.color}>
                                                <span>{room.name}</span>
                                            </Polygon>
                                        ))
                                    }
                                    {/*
                                        data.devices.find(d => d.mac === "f2:ec:8d:a5:22:dc")?.custom?.deviceCalcData.map(d =>
                                            <Circle mapRef={map} pos={[d.x, d.y]} radius={d.distance* data.devices.find(d => d.mac === "f2:ec:8d:a5:22:dc")?.custom?.dx} color="red"/>
                                        )
                                    }
                                    {
                                        data.devices.find(d => d.mac === "e0:d0:83:d6:2a:57")?.custom?.deviceCalcData.map(d =>
                                            <Circle mapRef={map} pos={[d.x, d.y]} radius={d.distance* data.devices.find(d => d.mac === "e0:d0:83:d6:2a:57")?.custom?.dx} color="red"/>
                                        )
                                    */}
                                </>
                            )}
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
                        {["NEAREST_FINGERPRINT", "TRILATERATION", "BRAIN"].includes(data.type) &&
                            data.beacons.filter((b) => b.x === 0 && b.y === 0 && b.f === 0).length ===
                                data.beacons.length && (
                                <div className="step-info">
                                    Zvol nástroj <i>Editovat pozice majáků</i> a rozmisť majáky na mapě!
                                </div>
                            )}
                        {["BRAIN"].includes(data.type) && data?.customLocalizationData?.fingerPrintsCount <= 10 && (
                            <div className="step-info">
                                Pro využítí neuronové sítě, není uloženo dostatek fingerprintů (min 10). Lokalizace se provádí na základě "NEAREST_FINGERPRINT". (počet fingerprintů: {data?.customLocalizationData?.fingerPrintsCount})
                            </div>
                        )}
                        {/* localization.customLocalizationData.fingerPrintsCount */}
                        {data.type === "WALDO" && (
                            <div className="step-info">
                                <img src="/img/waldo/waldo.jpg" alt="" height={80} style={{ marginRight: "20px" }} />
                                Where's Wally? / Where is Waldo - je hra, kde je cílem na obrázku Walda najít! Tato
                                lokalizace byla přidána automaticky po nalezení easter eggu!
                            </div>
                        )}
                        <div className="gap h-2"></div>
                        poslední výpočet:{" "}
                        {formats.toDMYHMS(new Date(data.customLocalizationData.caclulatingTimes.date))}
                        <div className="table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Název</th>
                                        <th>Poschodí</th>
                                        <th>Místnost</th>
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
                                            <td>{device.rooms.map((dr) => dr.name).join(", ")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {
                            timeData && <TimeLine
                                title="Aktivita zařízení"
                                items={timeData.map(t => {
                                return {
                                    name: t.device.name,
                                    sub: t.device.mac,
                                    activities: t.activities.map(a => {
                                        return {
                                            from: new Date(a.from),
                                            to: new Date(a.to),
                                            tooltip: formats.getHM(new Date(a.from))+" - "+formats.getHM(new Date(a.to))+"\n"+a.rooms.map(r => r.name).join(", ")
                                        }
                                    })
                                }
                            })}/>
                        }

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
                            <DeleteModal id={id} close={() => deleteModal.current.close()} />
                        </Modal>
                        <Modal ref={editRoomsModal}>
                            <EditRoomModal
                                localizationId={id}
                                update={update}
                                layers={getLayers(data.plan)}
                                rooms={data.rooms}
                                close={() => editRoomsModal.current.close()}
                            />
                        </Modal>
                    </>
                )}
            </div>
        </BlueLayout>
    )
}

export default LocalizationView
