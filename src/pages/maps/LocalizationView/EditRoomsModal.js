import React, {createRef, useState} from "react";
import Map from "../plans/Map";
import VectorSelect from "../plans/VectorSelect";
import AxiosInstance from "../../../utils/AxiosInstance";

const EditRoomModal = (props) => {
    const map = createRef()
    const selectRef = createRef()

    const states = {
        SELECT: 0,
        NEW_NAME: 1,
        CHANGE: 2
    }

    const [state, setState] = useState(states.SELECT)
    const [room, setRoom] = useState({
        id: null,
        name: "",
        f: 0,
        polygon: [
            [0, 0],
            [500, 500],
            [500, 0]
        ]
    })

    const handleSelect = () => {
        if(selectRef.current.value === "new") {
            setState(states.NEW_NAME)
        } else {
            const id = selectRef.current.value
            const room = props.rooms.find(r => r._id === id)

            setRoom({
                id: selectRef.current.value,
                name: room.name,
                f: room.f,
                polygon: room.polygon
            })
            setState(states.CHANGE)
        }
    }

    if(state === states.SELECT) {
        return (
            <>
                <h1>Upravení místností</h1>
                <br/>
                <label className="form-control">
                    <div className="title">Vyber místnost</div>
                    <select ref={selectRef}>
                        {props.rooms.map((room) => (
                            <option value={room._id}>
                                {room.name}
                            </option>
                        ))}
                        <option value={"new"}>
                            + Přidat novou místnost
                        </option>
                    </select>
                </label>
                <div className="text-right">
                    <div className="btn success" onClick={handleSelect}>Upravit</div>
                </div>
            </>
        )
    }

    const handleSetName = () => {
        setState(states.CHANGE)
    }

    if(state === states.NEW_NAME) {
        return (
            <>
                <h1>Upravení místností</h1>
                <br/>
                <label className="form-control">
                    <div className="title">Název místnosti</div>
                    <input type="text" placeholder="Zadej název místnosti" onChange={(e) => setRoom({...room, name: e.target.value})}/>
                </label>
                <div className="text-right">
                    <div className="btn success" onClick={handleSetName}>Nastavit</div>
                </div>
            </>
        )
    }

    const handleSave = () => {
        if(!room.id) {
           AxiosInstance.post('/localization/'+props.localizationId+'/room', room)
                .then(() => {
                    props.close()
                })
        } else {
            AxiosInstance.put('/room/'+room.id, room)
                .then(() => {
                    props.close()
                })
        }
    }

    const handleDelete = () => {
        AxiosInstance.delete('/room/'+room.id)
            .then(() => {
                props.close()
            })
    }

    return (
        <>
            <h1>Upravení místností - {room.name}</h1>
            <br/>
            <Map ref={map} layers={props.layers} afterInit={() => {}}>
                <VectorSelect mapRef={map} polygon={room.polygon} onChange={(e) => setRoom({...room, f: e.f, polygon: e.polygon})}/>
            </Map>
            <br/>
            <div className="text-right">
                <div className="btn success" onClick={handleSave}>Uložit</div>
                {room.id && <div className="btn empty" onClick={handleDelete}>Odebrat</div>}
            </div>
        </>
    )
}

export default EditRoomModal