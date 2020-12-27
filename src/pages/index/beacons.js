import T from "../../components/T";
import faker from "faker/locale/cz";
import React, {useEffect, useState} from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import Loading from "../../utils/loading";
import Format from "../../utils/formats";
import Modal from "../../components/Modal";

const Beacons = () => {
    const [beacons, setBeacons] = useState(null)
    const [int, setInt] = useState(null)

    const update = () => {
        AxiosInstance.get('/organization/beacon')
            .then((res) => {
                setBeacons(res.data)
            })
    }

    useEffect(() => {
        update()

        setInt(setInterval(update, 5000))

        return function cleanup() {
            clearInterval(int)
        }
    }, [])

    const getStatus = (beacon) => {
        const s =  Format.diffInSeconds(new Date(beacon.lastSeenDate))

        if(s <= 15) {
            return <div className="status online">Online</div>
        } else if (s <= 60) {
            return <div className="status warning">Loosing</div>
        }

        return <div className="status offline">Offline</div>
    }


    return (
        <div className="com-beacons">
            <h1><T id="page.pageIndex.beacons"/></h1>
            <div className="beacons">
                {
                    beacons ? (
                        <>
                            {beacons.map(beacon =>
                                <div className="beacon">
                                    {
                                        getStatus(beacon)
                                    }
                                    <div className="name">
                                        {beacon.name}
                                    </div>
                                    <div className="desc">
                                        <span className="key">{beacon.deviceKey}</span> <br/>
                                        {beacon.lastSeenDate ? (
                                            <><T id="components.index.beacons.lastData"/> {Format.toHMSWords(new Date(beacon.lastSeenDate))}</>
                                        ) : ""}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <Loading/>
                    )
                }
            </div>

            <Modal>

            </Modal>
        </div>
    )
}

export default Beacons