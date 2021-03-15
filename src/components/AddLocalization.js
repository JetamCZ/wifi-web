import React, { useEffect, useState } from "react"
import AxiosInstance from "../utils/AxiosInstance"
import QRcodeInput from "./QRcodeInput"
import SelectMoreInput from "./SelectMoreInput"

const AddLocalization = (props) => {
    const [plans, setPlans] = useState(null)
    const [beacons, setBeacons] = useState(null)

    const [minPlanError, setMinPlanError] = useState(false)

    const [sending, setSending] = useState(false)

    const [data, setData] = useState({
        name: "",
        planId: "",
        type: "NEAREST_FINGERPRINT",
        beacons: []
    })

    useEffect(() => {
        AxiosInstance.get("/plans").then((res) => {
            setPlans(res.data)

            if (res.data.length > 0) {
                setData({ ...data, planId: res.data[0]._id })
            } else {
                setMinPlanError(true)
            }
        })

        AxiosInstance.get("/beacons").then((res) => {
            setBeacons(res.data)

            if (res.data.length === 0) {
                setMinPlanError(true)
            }
        })
    }, [])

    const send = () => {
        setSending(true)

        AxiosInstance.post("/localization", data)
            .then(() => {
                props.onSent()
            })
            .finally(() => {
                setSending(false)
            })
    }

    return (
        <>
            <h1>Přidání nové lokalizace</h1>

            <br />
            <br />

            {minPlanError ? (
                <p>Pro vytvoření nové lokalizace, potřebujete mít vytvořený nejméně jeden plán a jeden maják!</p>
            ) : (
                <>
                    <label className="form-control">
                        <div className="title">Název lokalizace</div>
                        <input
                            type="text"
                            placeholder="Zadej název lokalizace"
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    </label>

                    <label className="form-control">
                        <div className="title">Typ lokalizace</div>
                        <select onChange={(e) => setData({ ...data, type: e.target.value })}>
                            <option value="NEAREST_FINGERPRINT">Nejbližší finger print</option>
                            <option value="TRILATERATION">Trilaterace</option>
                            <option value="BRAIN">Brain.js (Neurální síť)</option>
                        </select>
                    </label>

                    <label className="form-control">
                        <div className="title">Plán</div>
                        <select onChange={(e) => setData({ ...data, planId: e.target.value })}>
                            {plans &&
                                plans.map((plan) => (
                                    <option value={plan._id} key={plan._id}>
                                        {plan.name}
                                    </option>
                                ))}
                        </select>
                    </label>

                    <label className="form-control">
                        <div className="title">Majáky</div>
                        <SelectMoreInput
                            items={
                                beacons
                                    ? beacons.map((b) => {
                                          return { value: b.deviceKey, name: b.name }
                                      })
                                    : []
                            }
                            onChange={(value) =>
                                setData({
                                    ...data,
                                    beacons: value.map((v) => {
                                        return {
                                            deviceKey: v.value,
                                            x: 0,
                                            y: 0,
                                            f: 0
                                        }
                                    })
                                })
                            }
                        />
                    </label>

                    <div className="text-right">
                        {data.name && data.beacons.length > 0 && !sending ? (
                            <div className="btn success" onClick={send}>
                                Vytvořit lokalizaci
                            </div>
                        ) : (
                            <div className="btn disabled">Vytvořit lokalizaci</div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default AddLocalization
