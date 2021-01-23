import React from "react"
import PlanList from "./PlanList"
import LocalizationList from "./LocalizationList"

const MapList = () => {
    return (
        <div className="page-maps container">
            <h1>Plány</h1>
            <PlanList />

            <h1>Lokalizace</h1>
            <LocalizationList />
        </div>
    )
}

export default MapList
