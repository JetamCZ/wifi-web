import React, {createRef, useEffect, useState} from "react";
import faker from "faker/locale/cz";
import Modal from "../../components/Modal";
import T from "../../components/T";
import AxiosInstance from "../../utils/AxiosInstance";
import formats from "../../utils/formats";
import Translations from "../../utils/Translations";
import ViewBeacon from "../../components/viewBeacon";

const BeaconsList = () => {
    const [newBeacon, setNewBeacon] = useState({
        deviceKey: '',
        name: '',
        desc: ''
    })

    const [beacons, setBeacons] = useState(null)

    const setFormValue = (property, value) => {
        const newData = {...newBeacon}

        newData[property] = value

        setNewBeacon(newData)
    }

    const modal = createRef()
    const viewModal = createRef()

    const [viewBeaconId, setViewBeaconId] = useState(null)

    const createBeacon = () => {
        AxiosInstance.post('/organization/beacon', newBeacon)
            .then((res) => {
                modal.current.close()
                getBeacons()
            })
            .catch(() => {

            })
    }

    const getBeacons = () => {
        AxiosInstance.get('/organization/beacon')
            .then((res) => {
                setBeacons(res.data)
            })
    }

    useEffect(() => {
        getBeacons()
    }, [])

    const openView = (id) => {
        setViewBeaconId(id)
        viewModal.current.open()
    }

    return (
        <>
            <table className="table">
                <thead>
                <tr>
                    <th><T id='page.pageOrganization.beacons.name'/></th>
                    <th><T id='page.pageOrganization.beacons.desc'/></th>
                    <th><T id='page.pageOrganization.beacons.lastActivity'/></th>
                    <th className="text-right">
                        <div className="btn sm success" onClick={() =>{modal.current.open()}}>
                            <T id='page.pageOrganization.beacons.addBeacon'/>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    beacons && beacons.map((beacon, index) =>
                        <tr>
                            <td>
                                <div className="two-line">
                                    <div className="line">{beacon.name}</div>
                                    <div className="line light">{beacon.deviceKey}</div>
                                </div>
                            </td>
                            <td>
                                {beacon.desc}
                            </td>
                            <td>
                                {beacon.lastSeenDate ? formats.toHMSWords(new Date(beacon.lastSeenDate)) : Translations.getId('page.pageOrganization.beacons.neverSeen')}
                            </td>
                            <td className="text-right">
                                <div className="btn sm" onClick={() => openView(beacon._id)}>zobrazit maják</div>
                            </td>
                        </tr>
                    )
                }
                </tbody>
                {/*
                <tfoot>
                <tr>
                    <th colSpan="3" className="text-right">
                        <div className="btn sm success">1</div>
                    </th>
                </tr>
                </tfoot>
                */}
            </table>

            <Modal ref={viewModal}>
                <ViewBeacon id={viewBeaconId} refresh={getBeacons}/>
            </Modal>

            <Modal ref={modal}>
                <h1><T id='page.pageOrganization.beacons.addModal.title'/></h1>
                <p><T id='page.pageOrganization.beacons.addModal.desc'/></p>

                <div className="gap h-2"></div>

                <label>
                    <div className="title">Device key majáku</div>
                    <input type="text"
                           placeholder="Zadej device key"
                           onChange={(e) => setFormValue('deviceKey', e.target.value)}/>
                </label>

                <label>
                    <div className="title">Název (jakékoli pojmenování)</div>
                    <input type="text"
                           placeholder="Zadej název"
                           onChange={(e) => setFormValue('name', e.target.value)}/>
                </label>

                <label>
                    <div className="title">Popis umístění</div>
                    <input type="text"
                           placeholder="Zadej popis umístění majáku"
                           onChange={(e) => setFormValue('desc', e.target.value)}/>
                </label>

                <div className="text-right">
                    <div className="btn success" onClick={createBeacon}>Přidat maják</div>
                </div>
            </Modal>
        </>
    )
}

export default BeaconsList