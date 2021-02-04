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
import VectorSelect from "./plans/VectorSelect";
import DeleteModal from "./LocalizationView/DeleteModal";
import Polygon from "./plans/Polygon";
import EditRoomModal from "./LocalizationView/EditRoomsModal";
import BlueLayout from "../../layouts/BlueLayout";
import formats from "../../utils/formats";
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

    const [atr, setAtr] = useState(null)

    const { id } = useParams()

    const changeBeaconsPosModal = useRef()
    const setFingerPrintModal = useRef()
    const deleteModal = useRef()
    const editRoomsModal = useRef()

    const map = useRef()

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

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

    if(state === states.ERROR) {
        return (
            <div className="container">
                <h1>
                    <T id="error" />
                </h1>
            </div>
        )
    }

    if(state === states.DELETED) {
        return (
            <div className="container">
                <h1>
                    <T id="viewBeacon.deleted" />
                </h1>
            </div>
        )
    }

    if(state === states.LOADING) {
        return (
            <div className="container">
                <h1>
                    <T id="loading" />
                </h1>
            </div>
        )
    }

    const calc2 = (circle1, circle2) => {
        const c = Math.sqrt(Math.pow((circle1[0]-circle2[0]), 2) + Math.pow((circle1[1]-circle2[1]), 2))
        const d = (Math.pow(circle1[2], 2) + Math.pow(c, 2) - Math.pow(circle2[2], 2))/(2*c)
        const h = Math.sqrt(Math.pow(circle1[2], 2) - Math.pow(d, 2))

        return [
            [
                (circle2[0]-circle1[0])*d/c + (circle2[1]-circle1[1])*h/c + circle1[0],
                (circle2[1]-circle1[1])*d/c - (circle2[0]-circle1[0])*h/c + circle1[1]
            ],
            [
                (circle2[0]-circle1[0])*d/c - (circle2[1]-circle1[1])*h/c + circle1[0],
                (circle2[1]-circle1[1])*d/c + (circle2[0]-circle1[0])*h/c + circle1[1]
            ]
        ]
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
                        </div>

                        <Map
                            layers={getLayers(data.plan)}
                            ref={map}
                            afterInit={(remap) => {
                                if(["NEAREST_FINGERPRINT"].includes(data.type)) {
                                    L.easyButton(
                                        '<img src="/img/icons/crosshair-add.svg" alt="Make fingerprint" />',
                                        () => {
                                            setFingerPrintModal.current.open()
                                        },
                                        "Make new fingerprint"
                                    ).addTo(remap)
                                }

                                if(["NEAREST_FINGERPRINT", "TRILATERATION"].includes(data.type)) {
                                    L.easyButton(
                                        '<img src="/img/icons/wifi-edit.svg" alt="Edit position of beacons" />',
                                        () => {
                                            changeBeaconsPosModal.current.open()
                                        },
                                        "Edit beacons positions"
                                    ).addTo(remap)
                                }

                                if(["NEAREST_FINGERPRINT", "TRILATERATION"].includes(data.type)) {
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
                                                    control.state('hide');
                                                }
                                            },
                                            {
                                                stateName: "hide",
                                                icon: '<img src="/img/icons/home-hide.svg" alt="Hide rooms" />',
                                                title: "Hide rooms",
                                                onClick: (control) => {
                                                    setShowRooms(false)
                                                    control.state('show');
                                                }
                                            }
                                        ]
                                    }).addTo(remap)
                                }
                            }}
                        >
                            { map.current && <>
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
                                {
                                    showRooms && data.rooms.map(room =>
                                        <Polygon mapRef={map} polygon={room.polygon} f={room.f} color={room.color}><span>{room.name}</span></Polygon>
                                    )
                                }
                                {/*<VectorSelect mapRef={map}/>*/}
                                {/*<Polygon mapRef={map} polygon={[
                                    [0, 0],
                                    [500, 0],
                                    [0, 500]
                                ]} f={0}><span>abcd</span></Polygon>*/}

                                {/*
                                    data.devices.find(d => d.mac === "e0:d0:83:d6:2a:57")?.custom?.deviceCalcData.map(d =>
                                        <Circle mapRef={map} radius={d.distance*(global.d ?? 1)} pos={[d.x, d.y]}/>
                                    )
                                */}
                            </>}
                        </Map>

                        {
                            JSON.stringify(data?.devices[0]?.custom?.deviceCalcData)
                        }

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

                        {["NEAREST_FINGERPRINT", "TRILATERATION"].includes(data.type) &&
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

                        poslední výpočet: {formats.toDMYHMS(new Date(data.customLocalizationData.caclulatingTimes.date))}

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
                                            <td>
                                                {
                                                    device.rooms.map(dr => dr.name).join(", ")
                                                }
                                            </td>
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
                            <DeleteModal id={id} close={() => deleteModal.current.close()}/>
                        </Modal>

                        <Modal ref={editRoomsModal}>
                            <EditRoomModal localizationId={id} update={update} layers={getLayers(data.plan)} rooms={data.rooms} close={() => editRoomsModal.current.close()}/>
                        </Modal>
                    </>
                )}
            </div>
        </BlueLayout>
    )
}

export default LocalizationView
