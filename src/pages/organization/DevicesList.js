import React, {createRef, useEffect, useState} from "react";
import faker from "faker/locale/cz";
import oui from "oui";
import Jdenticon from "react-jdenticon";
import Modal from "../../components/Modal";
import AxiosInstance from "../../utils/AxiosInstance";
import {get} from "leaflet/src/dom/DomUtil";
import formats from "../../utils/formats";

const DeviceList = () => {
    const addModal = createRef()

    const [newDevice, setNewDevice] = useState({
        mac: '',
        name: '',
    })

    const [devices, setDevices] = useState()

    const setFormValue = (property, value) => {
        const newData = {...newDevice}

        newData[property] = value

        setNewDevice(newData)
    }

    const createDevice = () => {
        const auth = JSON.parse(window.localStorage.getItem("AUTH_USER"))

        AxiosInstance.post('/devices', newDevice)
            .then((res) => {
                addModal.current.close()
                getDevices()
            })
            .catch(() => {

            })
    }

    const getDevices = () => {
        AxiosInstance.get('/devices')
            .then((res) => {
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
                        <div className="btn sm success" onClick={() => {addModal.current.open()}}>Přidat další zařízení</div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    devices && devices.map((device, index) =>
                        <tr>
                            <td>
                                <div className="two-line">
                                    <div className="line">{device.mac}</div>
                                    <div className="line light">{oui(device.mac) || '-'}</div>
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
                                {
                                    device.lastSeenDate ? formats.toHMSWords(new Date(device.lastSeenDate)) : "?"
                                }
                            </td>
                            <td></td>
                            {/*
                            <td className="text-right">
                                <div className="btn sm">zobrazit člena</div>
                            </td>
                            */}
                        </tr>
                    )
                }
                </tbody>
                {/*
                <tfoot>
                <tr>
                    <th colSpan="3" className="text-right">
                        <div className="btn sm">1</div>
                        <div className="btn sm success">2</div>
                        <div className="btn sm">3</div>
                        <div className="btn sm">4</div>
                        <div className="btn sm">5</div>
                        <div className="btn sm">6</div>
                    </th>
                </tr>
                </tfoot>
                */}
            </table>
            </div>

            <Modal ref={addModal}>
                <h1>Přidání nového zařízení</h1>
                <p>Nové zařízení se automaticky přiřadí k Vašemu účtu.</p>

                <div className="gap h-2"></div>

                <label className="form-control">
                    <div className="title">Název (jakékoli pojmenování)</div>
                    <input type="text"
                           placeholder="Zadej název"
                           onChange={(e) => setFormValue('name', e.target.value)}/>
                </label>

                <label className="form-control">
                    <div className="title">Mac adresa</div>
                    <input type="text"
                           placeholder="Zadej mac adresu"
                           onChange={(e) => setFormValue('mac', e.target.value)}/>
                </label>

                <div className="text-right">
                    <div className="btn success" onClick={createDevice}>Přidat zařízení</div>
                </div>
            </Modal>
        </>
    )
}

export default DeviceList