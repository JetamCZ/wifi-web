import React, {useEffect, useRef, useState} from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import T from "../../components/T";
import Map from "./plans/Map";
import {useParams} from "react-router-dom";
import Modal from "../../components/Modal";
import ChangeBeaconsPos from "./ChangeBeaconPos";
import MakeFingerPrint from "./MakeFingerPrint";
import faker from "faker/locale/cz";

const LocalizationView = () => {
    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2,
        DELETED: 3
    }

    const [state, setState] = useState(states.LOADING)
    const [data, setData] = useState(null)

    const {id} = useParams()

    const changeBeaconsPosModal = useRef()
    const setFingerPrintModal = useRef()

    useEffect(() => {
        update()
        const interval = setInterval(update, 5000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [])

    const update = () => {
        AxiosInstance.get('/localization/'+id)
            .then((res) => {
                setData(res.data)
                setState(states.DONE)
            })
            .catch(() => {
                setState(states.ERROR)
            })
    }

    const getMapData = (d) => {
        const layers = {...d}.floors

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i]
            const beacons = data.beacons.filter(b => b.f === layer.floor)

            layer.markers = []

            beacons.forEach(b => {
                layer.markers.push({
                    xy: [b.y, b.x],
                    color: "red",
                    id: b._id,
                    popup: (
                        <div className="mini-beaconView">
                            <div className="title">
                                <div className="name">{b.name}</div>
                                <div className="key">{b.deviceKey}</div>
                                <br/>
                                <div className="summary-title">Popis umístění:</div>
                                <p>{b.desc || "..."}</p>
                            </div>
                        </div>
                    )
                })
            })

            const devices = data.devices.filter(d => d.f === layer.floor)
            devices.forEach(device => {
                layer.markers.push({
                    xy: [device.y, device.x],
                    color: "blue",
                    id: 'device-'+device.mac,
                    popup: (
                        <div className="mini-deviceView">
                            <div className="title">
                            <div className="name">{device.name}</div>
                                <div className="key">{device.mac}</div>
                            </div>
                        </div>
                    )
                })
            })

            delete layer._id
            //delete layer.floor
        }

        return layers
    }

    return (
        <div className="container">
            {
                state === states.LOADING && (
                    <h2><T id='loading'/></h2>
                )
            }

            {
                state === states.DONE && <>
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

                    <Map layers={getMapData(data.plan)}/>

                    <div className="tools">
                        <div className="item" onClick={() => {setFingerPrintModal.current.open()}}>
                            <img src={'/img/icons/crosshair.svg'} alt="Make fingerprint"/>
                            Přidat fingerprint
                        </div>
                        <div className="item" onClick={() => {changeBeaconsPosModal.current.open()}}>
                            <img src={'/img/icons/edit.svg'} alt="Edit icon"/>
                            Editovat pozice majáků
                        </div>
                        {/*
                        <div className="item">
                            <img src={'/img/icons/trash.svg'} alt="Trash icon"/>
                            <T id='viewBeacon.removeBtn'/>
                        </div>
                        */}
                    </div>

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
                            {data.devices.map(device =>
                                <tr key={device.mac}>
                                    <td>
                                        <div className="two-line">
                                            <div className="line">{device.name}</div>
                                            <div className="line light">{device.mac}</div>
                                        </div>
                                    </td>
                                    <td>
                                        {device.f}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>

                    <Modal ref={changeBeaconsPosModal}>
                        <ChangeBeaconsPos id={id} afterSave={() => {
                            changeBeaconsPosModal.current.close()
                            update()
                        }}/>
                    </Modal>

                    <Modal ref={setFingerPrintModal}>
                        <MakeFingerPrint id={id} afterSave={() => {
                            setFingerPrintModal.current.close()
                            update()
                        }}/>
                    </Modal>
                </>
            }

            {
                state === states.ERROR && (
                    <h1><T id='error'/></h1>
                )
            }

            {
                state === states.DELETED && (
                    <h1><T id='viewBeacon.deleted'/></h1>
                )
            }
        </div>
    )
}

export default LocalizationView