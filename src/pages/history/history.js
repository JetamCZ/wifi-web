import React, {useEffect, useState} from "react";
import TimeLine from "./components/TimeLine";
import formats from "../../utils/formats";
import AxiosInstance from "../../utils/AxiosInstance";

const History = () => {
    const [beaconsHistory, setBeaconHistory] = useState(null)

    useEffect(() => {
        update()
        const int = setInterval(update, 30*1000)

        return () => {
            clearInterval(int)
        }
    }, [])

    const update = () => {
        AxiosInstance.get('/history/beacons')
            .then(res => setBeaconHistory(res.data))
            .catch(() => {})
    }

    const beaconHistoryItems = beaconsHistory ? beaconsHistory.map(b => {
        return {
            name: b.beacon.name,
            sub: b.beacon.deviceKey,
            activities: b.activities.map(a => {
                return {
                    from: new Date(a.from),
                    to: new Date(a.to),
                    tooltip: formats.getHM(new Date(a.from))+" - "+formats.getHM(new Date(a.to))
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