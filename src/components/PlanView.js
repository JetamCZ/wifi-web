import React, {useEffect, useState} from "react";
import Map from "../pages/maps/plans/Map";
import AxiosInstance from "../utils/AxiosInstance";
import T from "./T";

const PlanView = (props) => {
    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2,
        DELETED: 3
    }

    const [state, setState] = useState(states.LOADING)
    const [data, setData] = useState(null)

    useEffect(() => {
        AxiosInstance.get('/plans/'+props.id)
            .then((res) => {
                setData(res.data)
                setState(states.DONE)

                getMapData(res.data)
            })
            .catch(() => {
                setState(states.ERROR)
            })
    }, [])

    const getMapData = (d) => {
        const layers = {...d}.floors

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i]

            delete layer._id
            layer.markers = []
        }

        return layers
    }

    return (
        <div className="viewPlan">
            {
                state === states.LOADING && (
                    <h2><T id='loading'/></h2>
                )
            }

            {
                state === states.DONE && <>
                    <h1 className="name">{data.name}</h1>

                    <div className="summary">
                        <div className="item">
                            <div className="title">Počet pater:</div>
                            <div className="value">{data.floors.length}</div>
                        </div>
                    </div>

                    <Map layers={getMapData(data)}/>
                </>
            }

            {
                state === states.ERROR && (
                    <h1><T id='error'/></h1>
                )
            }

            {
                state === states.DELETED && (
                    <h1><T id='viewBeacon.deleted'/></h1>
                )
            }
        </div>
    )
}

export default PlanView