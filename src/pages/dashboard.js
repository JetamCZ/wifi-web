import React, { createRef } from "react"
import Loading from "../utils/loading"
import Beacons from "./index/beacons"
import ActivePeople from "./index/ActivePeople"
import Modal from "../components/Modal"

const DashBoard = () => {
    const modal = createRef()

    return (
        <div className="pageIndex container">
            <ActivePeople />
            <Beacons />

            <h1>Todo List</h1>
            <br />
            <div className="btn success" onClick={() => modal.current.open()}>
                Zobrazit Todo List
            </div>
            <Modal ref={modal}>
                <h1>Todo list</h1>

                <h3>Uživatelé</h3>
                <ul>
                    <li>
                        <strike>Přidávání uživatelů</strike>
                    </li>
                    <li>
                        <strike>Odebrání uživatelů</strike>
                    </li>
                    <li>Editace</li>
                </ul>

                <h3>Zažízení</h3>
                <ul>
                    <li>Přidání zařízení</li>
                    <li>Odebrání zařízení</li>
                </ul>

                <h3>Majáky</h3>
                <ul>
                    <li>
                        <strike>Přiřazní majáku k účtu</strike>
                    </li>
                    <li>Editace</li>
                    <li>
                        <strike>Odebrání</strike>
                    </li>
                </ul>
            </Modal>
        </div>
    )
}

export default DashBoard
