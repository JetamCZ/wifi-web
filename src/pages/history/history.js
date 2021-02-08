import React, {useEffect, useState} from "react";
import TimeLine from "./components/TimeLine";
import formats from "../../utils/formats";
import AxiosInstance from "../../utils/AxiosInstance";

const History = () => {
    const [beaconsHistory, setBeaconHistory] = useState(null)

    useEffect(() => {
        AxiosInstance.get('/history/beacons')
            .then(res => setBeaconHistory(res.data))
            .catch(() => {})
    }, [])

    const beaconHistoryItems = beaconsHistory ? beaconsHistory.map(b => {
        return {
            name: b.beacon.name,
            sub: b.beacon.deviceKey,
            activities: b.activities.map(a => {
                return {
                    from: new Date(a.from),
                    to: new Date(a.to),
                    tooltip: (new Date(a.from).getHours())+":"+(new Date(a.from).getMinutes())+" - "+(new Date(a.to).getHours())+":"+(new Date(a.to).getMinutes())
                }
            })
        }
    }) : []

    return (
        <div className="container">
            {
                beaconsHistory && <TimeLine
                    title="Majáky"
                    look="DAY"
                    items={beaconHistoryItems}/>
            }
        </div>
    )
}

export default History