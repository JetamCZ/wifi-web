import React, {useEffect, useRef, useState} from "react";
import AxiosInstance from "../utils/AxiosInstance";
import T from "./T";
import formats from "../utils/formats";
import oui from "oui";
import Modal from "./Modal";

const ViewBeacon = (props) => {
    const {id} = props

    const editModal = useRef()

    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2,
        DELETED: 3
    }

    const [state, setState] = useState(states.LOADING)
    const [beaconData, setBeaconData] = useState()

    const [editData, setEditData] = useState({
        name: "",
        desc: ""
    })

    useEffect(() => {
        update()
    }, [])

    const update = () => {
        AxiosInstance.get('/beacons/'+id)
            .then((res) => {
                setBeaconData(res.data)
                setState(states.DONE)

                setEditData({
                    name: res.data.name,
                    desc: res.data.desc
                })
            })
            .catch(() => {
                setState(states.ERROR)
            })
    }

    const remove = () => {
        AxiosInstance.delete('/beacons/'+id)
            .then(() => {
                setState(states.DELETED)

                if(props.refresh) {
                    props.refresh()
                }
            })
    }

    const save = () => {
        AxiosInstance.put('/beacons/'+id, editData)
            .then(res => {
                    editModal.current.close()
                    update()

                    if(props.refresh) {
                        props.refresh()
                    }
                }
            )
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
                    <div className="modalView">
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
                            <div className="item" onClick={() => {editModal.current.open()}}>
                                <img src={'/img/icons/edit.svg'} alt="Edit icon"/>
                                Editovat maják
                            </div>
                            <div className="item" onClick={remove}>
                                <img src={'/img/icons/trash.svg'} alt="Trash icon"/>
                               <T id='viewBeacon.removeBtn'/>
                            </div>
                        </div>

                        <Modal ref={editModal}>
                            <h1>Editace majáku</h1>

                            <div className="gap h-2"></div>

                            <label className="form-control">
                                <div className="title">Název</div>
                                <input type="text"
                                       onChange={(e) => {setEditData({...editData, name: e.target.value})}}
                                       defaultValue={beaconData.name}
                                       placeholder="Zadej název"/>
                            </label>

                            <label className="form-control">
                                <div className="title">Popis umístění</div>
                                <input type="text"
                                       onChange={(e) => {setEditData({...editData, desc: e.target.value})}}
                                       defaultValue={beaconData.desc}
                                       placeholder="Zadej popis umístění"/>
                            </label>

                            <div className="text-right">
                                <div className="btn success" onClick={save}>Upravit maják</div>
                            </div>
                        </Modal>

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