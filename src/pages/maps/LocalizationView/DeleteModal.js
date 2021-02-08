import React from "react"
import AxiosInstance from "../../../utils/AxiosInstance"
import { useHistory } from "react-router-dom"

const DeleteModal = (props) => {
    const history = useHistory()

    const del = () => {
        AxiosInstance.delete("/localization/" + props.id).then(() => {
            props.close()
            history.push("/localizations")
        })
    }

    return (
        <>
            <h1>Přejete si smazat tuto lokalizaci?</h1>
            <p>Tato akce je nevratná a ztratíte veškeré fingerprinty.</p>

            <br />
            <br />

            <div className="btn danger" onClick={del}>
                Ano, smazat
            </div>
            <div className="btn" onClick={props.close}>
                Ponechat
            </div>
        </>
    )
}

export default DeleteModal
