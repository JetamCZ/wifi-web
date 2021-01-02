import React, {createRef, useEffect, useState} from "react";
import Jdenticon from "react-jdenticon";
import faker from "faker/locale/cz";
import AxiosInstance from "../../utils/AxiosInstance";
import Modal from "../../components/Modal";
import T from "../../components/T";
import GenerateInv from "./genereateInv";
import formats from "../../utils/formats";
import oui from "oui";
import ViewPerson from "../../components/viewPerson";

const People = () => {
    const [people, setPeople] = useState(null)

    const modal = createRef()
    const viewPerson = createRef()

    const [personId, setPersonId] = useState()

    useEffect(() => {
        update()
        const int = setInterval(update, 5000)

        return function cleanup() {
            clearInterval(int)
        }
    }, [])

    const update = () => {
        AxiosInstance.get('/organization/people')
            .then(res => {
                setPeople(res.data)
            })
    }

    const showPerson = (id) => {
        setPersonId(id)
        viewPerson.current.open()
    }

    return (
        <>
            <div className="table-wrapper">
            <table className="table">
                <thead>
                <tr>
                    <th><T id='page.pageOrganization.members.name'/></th>
                    <th><T id='page.pageOrganization.members.lastActivity'/></th>
                    <th className="text-right">
                        <div className="btn sm success" onClick={() => {modal.current.open()}}><T id='page.pageOrganization.members.invite'/></div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    people && people.map(person =>
                        <tr>
                            <td>
                                <div className="avatar">
                                    <Jdenticon size="30px" value={person.email} />
                                </div>
                                <div className="two-line">
                                    <div className="line">{person.name}</div>
                                    <div className="line light">{person.email}</div>
                                </div>
                            </td>
                            <td><T id='before'/> {person.lastSeen ? formats.toHMSWords(new Date(person.lastSeen)) : '?'}</td>
                            <td className="text-right">
                                <div className="btn sm" onClick={() => showPerson(person._id)}>zobrazit člena</div>
                            </td>
                        </tr>
                    )
                }
                </tbody>
                {/*
                <tfoot>
                <tr>
                    <th colSpan="3" className="text-right">
                        <div className="btn sm">1</div>
                        <div className="btn sm success">2</div>
                        <div className="btn sm">3</div>
                    </th>
                </tr>
                </tfoot>
                */}
            </table>
            </div>

            <Modal ref={modal}>
                <h1><T id='page.pageOrganization.members.modal.title'/></h1>
                <p><T id='page.pageOrganization.members.modal.info'/></p>
                <GenerateInv/>
            </Modal>

            <Modal ref={viewPerson}>
                <ViewPerson id={personId} refresh={update}/>
            </Modal>
        </>
    )
}

export default People