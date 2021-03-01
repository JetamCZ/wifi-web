import React, {useEffect, useState} from "react"
import Beacons from "../index/beacons"
import ActivePeople from "../index/ActivePeople"
import Warnings from "./Warning";
import Locs from "./Locs";
import AxiosInstance from "../../utils/AxiosInstance";

const DashBoard = () => {
    const [data, setData] = useState()

    useEffect(() => {
        update()
        const int = setInterval(update, 3000)

        return () => {
            clearInterval(int)
        }

    }, [])

    const update = () => {
        AxiosInstance.get('/organization/now')
            .then((res) => {
                setData(res.data)
            })
            .catch(() => {})
    }

    return (
        <div className="page-dashboard pageIndex container">
            <Warnings warnings={data?.warnings ?? []}/>
            <ActivePeople people={data?.people ?? []}/>

            <Locs localizations={data?.localizations ?? []}/>

            {/*
            <Beacons />
            */}
        </div>
    )
}

export default DashBoard
