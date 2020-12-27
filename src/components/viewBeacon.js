import React, {useEffect, useState} from "react";
import AxiosInstance from "../utils/AxiosInstance";
import T from "./T";
import Jdenticon from "react-jdenticon";
import formats from "../utils/formats";
import faker from "faker/locale/cz";
import oui from "oui";

const ViewBeacon = (props) => {
    const {id} = props

    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2,
        DELETED: 3
    }

    const [state, setState] = useState(states.LOADING)
    const [beaconData, setBeaconData] = useState()

    useEffect(() => {
        AxiosInstance.get('/organization/beacon/'+id)
            .then((res) => {
                setBeaconData(res.data)
                setState(states.DONE)
            })
            .catch(() => {
                setState(states.ERROR)
            })
    }, [])

    const remove = () => {
        AxiosInstance.delete('/organization/beacon/'+id)
            .then(() => {
                setState(states.DELETED)

                if(props.refresh) {
                    props.refresh()
                }
            })
    }

    return (
        <>
            {
                state === states.LOADING && (
                    <h2><T id='loading'/></h2>
                )
            }

            {
                state === states.DONE && (
                    <div className="viewBeacon">
                        <h1 className="name">{beaconData.name}</h1>

                        <div className="summary">
                            <div className="item">
                                <div className="title"><T id='viewBeacon.lastSeen'/>:</div>
                                <div className="value">
                                    {
                                        beaconData.lastSeenDate ? <>
                                            {formats.toDMYHMS(new Date(beaconData.lastSeenDate))}
                                            (<T id='before'/> {formats.toHMSWords(new Date(beaconData.lastSeenDate))})
                                        </> : "?"

                                    }
                                </div>
                            </div>
                            <div className="item">
                                <div className="title"><T id='viewBeacon.desc'/>:</div>
                                <div className="value">{beaconData.desc}</div>
                            </div>
                        </div>

                        <table className="table">
                            <thead>
                            <tr>
                                <th><T id='viewBeacon.table.mac'/></th>
                                <th><T id='viewBeacon.table.rssi'/></th>
                                <th><T id='viewBeacon.table.lastActivity'/></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                beaconData.devices.map(device =>
                                    <tr>
                                        <td>
                                            <div className="two-line">
                                                <div className="line">{device.mac}</div>
                                                <div className="line light">{oui(device.mac) || '-'}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {device.rssi} db
                                        </td>
                                        <td>
                                            {formats.toDMYHMS(new Date(device.date))} {" "}
                                            (<T id='before'/> {formats.toHMSWords(new Date(device.date))})
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>

                        <div className="tools">
                            {/*
                            <div className="item">
                                <img src={'/img/icons/edit.svg'} alt="Edit icon"/>
                                Editovat maják
                            </div>
                            */}
                            <div className="item" onClick={remove}>
                                <img src={'/img/icons/trash.svg'} alt="Trash icon"/>
                               <T id='viewBeacon.removeBtn'/>
                            </div>
                        </div>
                    </div>
                )
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
        </>
    )
}

export default ViewBeacon