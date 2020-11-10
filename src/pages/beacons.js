import React, {useEffect, useState} from "react";
import Text from "../components/Text";
import Format from "../utils/formats"
import Loading from "../utils/loading";
import AxiosInstance from "../utils/AxiosInstance";
import TimeDiff from "../components/TimeDiff";
import Breadcrumbs from "../components/Breadcrumbs";

const Beacons = () => {
    const [data, setData] = useState(null)
    const [dataError, setDataError] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null)

    const [canRequestNext, setCanRequestNext] = useState(true)

    const update = () => {
        if(canRequestNext) {
            setCanRequestNext(false);

            AxiosInstance.get('beacons')
                .then((response) => {
                    setData(response.data)
                    setDataError(false)
                    setLastUpdate(new Date())
                })
                .catch(() => {
                    setDataError(true)
                })
                .finally(() => {
                    setCanRequestNext(true)
                })
        }
    }

    useEffect(() =>{
        update()
        const interval = setInterval(update, 3000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className="page-beacons w-page-800">
            <Breadcrumbs items={[
                {href: '', item: <Text id='menu.beacons'>Beacons</Text>}
            ]}/>
            {
                data ? (
                    <table className={"table shadow"}>
                        <thead>
                        <tr>
                            <th colSpan={4} className="text-right">
                                <Text id={"page-beacons.table.last-update"}>Poslední update</Text>: {Format.time(lastUpdate)}
                            </th>
                        </tr>
                        <tr>
                            <th><Text id={"page-beacons.table.name"}>Název</Text></th>
                            <th><Text id={"page-beacons.table.device-key"}>Klíč zařízení</Text></th>
                            <th><Text id={"page-beacons.table.last-data"}>Poslední data</Text></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                data.map(beacon =>
                                    <tr>
                                        <td>
                                            {
                                                beacon.name ? beacon.name : (
                                                    <span className="text-gray-400"><Text id={'page-beacons.table.unknown-name'}>Neznámý název</Text></span>
                                                )
                                            }
                                        </td>
                                        <td>{beacon.deviceKey}</td>
                                        <td>
                                            {Format.dateTime(new Date(beacon.lastSeenDate))} <br/>
                                            {Format.diff(new Date(beacon.lastSeenDate))}
                                        </td>
                                        <td>
                                            {
                                                Format.diffInSeconds(new Date(beacon.lastSeenDate)) < 10 && (
                                                    <span className="badge badge-success">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                                                        </svg>
                                                        ONLINE
                                                    </span>
                                                )
                                            }
                                            {
                                                (
                                                    Format.diffInSeconds(new Date(beacon.lastSeenDate)) >= 10 
                                                    && Format.diffInSeconds(new Date(beacon.lastSeenDate)) < 30
                                                ) && (
                                                    <span className="badge badge-warning">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                        </svg>
                                                        WARNING
                                                    </span>
                                                )
                                            }
                                            {
                                                Format.diffInSeconds(new Date(beacon.lastSeenDate)) >= 30 && (
                                                    <span className="badge badge-danger">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                                                        </svg>
                                                        OFFLINE
                                                    </span>
                                                )
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                ) : (
                    <Loading isError={dataError}/>
                )
            }
        </div>
    )
}

export default Beacons;