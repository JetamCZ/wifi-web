import React, { useEffect, useState } from "react"
import Text from "../components/Text"
import Loading from "../utils/loading"
import AxiosInstance from "../utils/AxiosInstance"
import Format from "../utils/formats"
import setHeader from "../utils/setHeader"
import { useParams } from "react-router-dom"
import Breadcrumbs from "../components/Breadcrumbs"

const Device = () => {
    const [data, setData] = useState(null)
    const [lastUpdate, setLastUpdate] = useState("")
    const [dataError, setDataError] = useState(false)

    const { macAddress } = useParams()

    setHeader("Device")

    useEffect(() => {
        update()
        const interval = setInterval(update, 1000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [])

    const update = () => {
        AxiosInstance.get("devices/" + macAddress)
            .then((response) => {
                let data = response.data

                setData(data)
                setDataError(false)
                setLastUpdate(Format.time(new Date()))
            })
            .catch(() => {
                setDataError(true)
            })
    }

    return (
        <div className="page-device w-page-800">
            <Breadcrumbs
                items={[
                    { href: "/devices", item: <Text id={"menu.devices"}>Zařízení</Text> },
                    {
                        href: "",
                        item: data && data.name ? data.name + " (" + data.mac + ")" : macAddress
                    }
                ]}
            />

            {data ? (
                <>
                    <table className="table shadow">
                        <thead>
                            <tr>
                                <th colSpan={2}>
                                    <Text id="device-page.details">Info o zařízení</Text>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>
                                    <Text id={"device-page.macAddress"}>Mac adresa</Text>
                                </th>
                                <td>{data.mac}</td>
                            </tr>
                            <tr>
                                <th>
                                    <Text id={"device-page.name"}>Název</Text>
                                </th>
                                <td>{data.name}</td>
                            </tr>
                            <tr>
                                <th>
                                    <Text id={"device-page.vendor"}>Výrobce</Text>
                                </th>
                                <td>{data.vendor}</td>
                            </tr>
                            <tr>
                                <th>
                                    <Text id={"device-page.lastSeen"}>Poslední záznam</Text>
                                </th>
                                <td>
                                    {Format.dateTime(new Date(data.lastSeenDate))}
                                    <br /> {Format.diff(new Date(data.lastSeenDate))}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>
                        <Text id="device-page.rssis">
                            Síli signálů (<Text id="device-page.lastUpdate">Poslední update</Text>: {lastUpdate})
                        </Text>
                    </h2>
                    <div className="beacons">
                        {data.lastSeens.map((ls) => (
                            <div className="beacon">
                                <div className="rssi">{ls.rssi} db</div>
                                <div className="name">{ls.name}</div>
                                <div className="key">{ls.deviceKey}</div>
                                <div className="date">{Format.diff(new Date(ls.date))}</div>
                            </div>
                        ))}
                    </div>

                    <div className="shadow bg-white">
                        <div className="box-header">Mapka - test</div>
                        <img src="/img/map.png" className="w-100 opacity-1" />
                    </div>
                </>
            ) : (
                <Loading isError={dataError} />
            )}
        </div>
    )
}

export default Device
