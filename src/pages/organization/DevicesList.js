import React, { createRef, useEffect, useState } from "react"
import faker from "faker/locale/cz"
import oui from "oui"
import Jdenticon from "react-jdenticon"
import Modal from "../../components/Modal"
import AxiosInstance from "../../utils/AxiosInstance"
import { get } from "leaflet/src/dom/DomUtil"
import formats from "../../utils/formats"
import UserController from "../../controllers/UserController";
import AddDeviceModal from "./AddDeviceModal";

const DeviceList = () => {
    const addModal = createRef()
    const [devices, setDevices] = useState()

    const getDevices = () => {
        AxiosInstance.get("/devices").then((res) => {
            setDevices(res.data)
        })
    }

    useEffect(() => {
        getDevices()
        const int = setInterval(getDevices, 5000)

        return function cleanup() {
            clearInterval(int)
        }
    }, [])

    return (
        <>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Mac adresa</th>
                            <th>Vlastník</th>
                            <th>Název</th>
                            <th>Poslední aktivita</th>
                            <th className="text-right">
                                <div
                                    className="btn sm success"
                                    onClick={() => {
                                        addModal.current.open()
                                    }}
                                >
                                    Přidat další zařízení
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices &&
                            devices.map((device) => (
                                <tr>
                                    <td>
                                        <div className="two-line">
                                            <div className="line">{device.mac}</div>
                                            <div className="line light">{oui(device.mac) || "-"}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="avatar">
                                            <Jdenticon size="30px" value={device.user.email} />
                                        </div>
                                        <div className="two-line">
                                            <div className="line">{device.user.name}</div>
                                            <div className="line light">{device.user.email}</div>
                                        </div>
                                    </td>
                                    <td>{device.name}</td>
                                    <td>
                                        {device.lastSeenDate ? formats.toHMSWords(new Date(device.lastSeenDate)) : "?"}
                                    </td>
                                    <td></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <Modal ref={addModal}>
                <AddDeviceModal afterSave={() => {
                    addModal.current.close()
                    getDevices()
                }}/>
            </Modal>
        </>
    )
}

export default DeviceList
