import React, { createRef, useRef, useState } from "react"
import Modal from "./Modal"
import QrReader from "react-qr-reader"

const QRcodeInput = (props) => {
    const [code, setCode] = useState("")

    const modalReaderRef = useRef()

    const handleScan = (data) => {
        if (data) {
            setCode(data)
            props.onChange(data)
            modalReaderRef.current.close()
        }
    }

    const handleUserInput = (e) => {
        setCode(e.target.value)
        props.onChange(e.target.value)
    }

    return (
        <>
            <div className="input-status qr">
                <input type="text" value={code} onChange={handleUserInput} placeholder={props.placeholder} />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => {
                        modalReaderRef.current.open()
                    }}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                </svg>
            </div>

            <Modal ref={modalReaderRef}>
                <QrReader
                    delay={2}
                    onError={(e) => console.log(e)}
                    onScan={(val) => handleScan(val)}
                    style={{ width: "100%" }}
                    facingMode={"user"}
                />
            </Modal>
        </>
    )
}

export default QRcodeInput
