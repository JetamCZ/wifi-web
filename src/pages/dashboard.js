import React from "react"
import Beacons from "./index/beacons"
import ActivePeople from "./index/ActivePeople"

const DashBoard = () => {
    return (
        <div className="pageIndex container">
            <ActivePeople />
            <Beacons />
        </div>
    )
}

export default DashBoard
