import React, {useEffect, useState} from "react";
import Text from "../components/Text";
import Loading from "../utils/loading";
import AxiosInstance from "../utils/AxiosInstance";
import Format from "../utils/formats";
import setHeader from "../utils/setHeader";
import Table from "./devices/table";
import Breadcrumbs from "../components/Breadcrumbs";


const Devices = () => {
    const [data, setData] = useState(null);
    const [lastUpdate, setLastUpdate] = useState("");
    const [dataError, setDataError] = useState(false);

    setHeader('Devices')

    useEffect(() => {
        update()
        const interval = setInterval(update, 3000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, []);

    const update = () => {
        AxiosInstance.get('devices')
            .then((response) => {
                let data = response.data

                data = data.sort((a, b) => {
                    return a.mac > b.mac ? 1 : 1
                })

                setData(data)
                setDataError(false)
                setLastUpdate(Format.time(new Date()))
            })
            .catch(() => {
                setDataError(true);
            })
    }

    const selected = [
        'e0:d0:83:d6:2a:57', //Matěj Telefon
        '58:00:e3:ca:99:01', //Matěj NTB
    ]

    const samsung = false;

    return (
        <div className="page-devices w-page-1000">
            <Breadcrumbs items={[
                {href: '', item: <Text id={'menu.devices'}>Zařízení</Text>}
            ]}/>

            {
                data ? (
                    <>
                        <h2><Text id='device-page.selected-devices'>Vybraná zařízení</Text></h2>
                        <Table
                            devices={
                                data.filter(device =>
                                    selected.includes(device.mac)
                                    || selected.includes(device.name)
                                    || (samsung && device.vendor && device.vendor.includes('Samsung'))
                                )}
                            lastUpdate={lastUpdate}
                        />

                        <h2><Text id='device-page.all-devices'>Všechna zařízení</Text></h2>
                        <Table
                            devices={data}
                            lastUpdate={lastUpdate}
                        />
                    </>
                ) : (
                    <div className="w-page-800">
                        <Loading isError={dataError}/>
                    </div>
                )
            }
        </div>
    )
}

export default Devices