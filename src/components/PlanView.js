import React, {useEffect, useRef, useState} from "react"
import Map from "../pages/maps/plans/Map"
import AxiosInstance from "../utils/AxiosInstance"
import T from "./T"
import Toast from "../utils/Toast"
import Modal from "./Modal";

const PlanView = (props) => {
    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2,
        DELETED: 3
    }

    const [state, setState] = useState(states.LOADING)
    const [data, setData] = useState(null)

    const renameModalRef = useRef()
    const [renameName, setRenameName] = useState("")

    useEffect(() => {
        update()
    }, [])

    const update = () => {
        AxiosInstance.get("/plans/" + props.id)
            .then((res) => {
                setData(res.data)
                setState(states.DONE)

                getMapData(res.data)
            })
            .catch(() => {
                setState(states.ERROR)
            })
    }

    const getMapData = (d) => {
        const layers = { ...d }.floors

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i]

            delete layer._id
            layer.markers = []
        }

        return layers
    }

    const remove = () => {
        AxiosInstance.delete("/plans/" + props.id)
            .then(() => {
                props.update()
            })
            .catch(() => {
                Toast.fire({
                    icon: "error",
                    title: "Plán nelze odebrat, je přiřazen k některé z lokalizací!"
                })
            })
    }

    const rename = () => {
        AxiosInstance.put("/plans/" + props.id, {name: renameName})
            .then(() => {
                renameModalRef.current.close()
                update()
                props.update()
            })
            .catch(() => {})
    }

    return (
        <div className="viewPlan">
            {state === states.LOADING && (
                <h2>
                    <T id="loading" />
                </h2>
            )}

            {state === states.DONE && (
                <>
                    <h1 className="name">{data.name}</h1>

                    <div className="summary">
                        <div className="item">
                            <div className="title">Počet pater:</div>
                            <div className="value">{data.floors.length}</div>
                        </div>
                    </div>

                    <Map layers={getMapData(data)} />

                    <div className="tools">
                        <div className="item" onClick={() => {
                            setRenameName(data?.name)
                            renameModalRef.current.open()
                        }}>
                            <img src={"/img/icons/edit.svg"} alt="Edit icon" />
                            Přejmenovat
                        </div>
                        <div className="item" onClick={remove}>
                            <img src={"/img/icons/trash.svg"} alt="Trash icon" />
                            Odebrat plán
                        </div>
                    </div>
                </>
            )}

            {state === states.ERROR && (
                <h1>
                    <T id="error" />
                </h1>
            )}

            {state === states.DELETED && (
                <h1>
                    <T id="viewBeacon.deleted" />
                </h1>
            )}

            <Modal ref={renameModalRef}>
                <h1>Přejmenování plánu</h1>
                <br/>
                <label className="form-control">
                    <div className="title">Název</div>
                    <input type="text" placeholder="Zadej název" defaultValue={data?.name} onChange={(e) => setRenameName(e.target.value)}/>
                </label>
                <div className="text-right">
                    <div className="btn success" onClick={rename}>Přejmenovat</div>
                </div>
            </Modal>
        </div>
    )
}

export default PlanView
