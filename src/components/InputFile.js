import React, { useState } from "react"
import AxiosInstance from "../utils/AxiosInstance"

const InputFile = (props) => {
    const states = {
        SELECT_FILE: 0,
        UPLOADING: 1,
        DONE: 2
    }

    const [state, setState] = useState(states.SELECT_FILE)
    const [url, setUrl] = useState("")

    const upload = (file) => {
        setState(states.UPLOADING)

        const formData = new FormData()
        formData.append("img", file[0])

        AxiosInstance.post("img/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            timeout: 60 * 1000
        })
            .then((res) => {
                setState(states.DONE)
                setUrl(res.data)
                props.set(res.data)
            })
            .catch(() => {
                setState(states.SELECT_FILE)
            })
    }

    const remove = () => {
        setUrl(null)
        setState(states.SELECT_FILE)
        props.delete()
    }

    if (state === states.SELECT_FILE) {
        return <input type="file" onChange={(e) => upload(e.target.files)} />
    }

    if (state === states.UPLOADING) {
        return <div className="input-status">Nahrávání...</div>
    }

    return (
        <>
            <div className="input-status">{url}</div>
            <div className="text-right">
                <div className="btn danger sm" onClick={remove}>
                    Odebrat
                </div>
            </div>
        </>
    )
}

export default InputFile
