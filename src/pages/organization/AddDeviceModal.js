import React, { useEffect, useState } from "react"
import AxiosInstance from "../../utils/AxiosInstance"
import UserController from "../../controllers/UserController"

const AddDeviceModal = (props) => {
    const [newDevice, setNewDevice] = useState({
        mac: "",
        name: "",
        userId: UserController.getUser()?._id
    })

    const [people, setPeople] = useState([])

    useEffect(() => {
        AxiosInstance.get("/organization/people")
            .then((res) => {
                setPeople(res.data)
            })
            .catch(() => {})
    }, [])

    const setFormValue = (property, value) => {
        const newData = { ...newDevice }

        newData[property] = value

        setNewDevice(newData)
    }

    const createDevice = () => {
        AxiosInstance.post("/devices", newDevice)
            .then((res) => {
                props.afterSave()
            })
            .catch(() => {})
    }

    return (
        <>
            <h1>Přidání nového zařízení</h1>
            <p>Nové zařízení se automaticky přiřadí k Vašemu účtu.</p>

            <div className="gap h-2"></div>

            <label className="form-control">
                <div className="title">Název (jakékoli pojmenování)</div>
                <input type="text" placeholder="Zadej název" onChange={(e) => setFormValue("name", e.target.value)} />
            </label>

            <label className="form-control">
                <div className="title">Majitel</div>
                <select
                    defaultValue={UserController.getUser()?._id}
                    onChange={(e) => setFormValue("userId", e.target.value)}
                >
                    {people.length === 0 ? (
                        <option value={UserController.getUser()?._id}>{UserController.getUser()?.name}</option>
                    ) : (
                        people.map((person) => <option value={person._id}>{person.name}</option>)
                    )}
                </select>
            </label>

            <label className="form-control">
                <div className="title">Mac adresa</div>
                <input
                    type="text"
                    placeholder="Zadej mac adresu"
                    onChange={(e) => setFormValue("mac", e.target.value)}
                />
            </label>

            <div className="text-right">
                <div className="btn success" onClick={createDevice}>
                    Přidat zařízení
                </div>
            </div>
        </>
    )
}

export default AddDeviceModal
