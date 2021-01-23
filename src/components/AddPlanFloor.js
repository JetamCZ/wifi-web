import React, { useState } from "react"
import InputFile from "./InputFile"

const AddPlanFloor = (props) => {
    const [data, setData] = useState({
        name: "",
        image: ""
    })

    return (
        <div>
            <h1>Přidání patra</h1>

            <br />
            <br />

            <label className="form-control">
                <div className="title">Název patra</div>
                <input
                    type="text"
                    placeholder="Zadej název"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                />
            </label>

            <label className="form-control">
                <div className="title">Název patra</div>
                <InputFile
                    set={(url) => setData({ ...data, image: url })}
                    delete={() => setData({ ...data, image: "" })}
                />
            </label>

            <div className="text-right">
                {data.name && data.image ? (
                    <div className="btn success" onClick={() => props.callBack({ ...data })}>
                        Přidat patro
                    </div>
                ) : (
                    <div className="btn disabled">Přidat patro</div>
                )}
            </div>
        </div>
    )
}

export default AddPlanFloor
