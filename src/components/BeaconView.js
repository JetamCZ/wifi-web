import React, {useEffect, useState} from "react";
import AxiosInstance from "../utils/AxiosInstance";
import T from "./T";
import Jdenticon from "react-jdenticon";
import formats from "../utils/formats";
import faker from "faker/locale/cz";
import oui from "oui";

const BeaconView = ({id}) => {
    const states = {
        LOADING: 0,
        DONE: 1,
        ERROR: 2
    }

    const [state, setState] = useState(states.LOADING)
    const [personData, setPersonData] = useState()

    useEffect(() => {
        AxiosInstance.get('/organization/person/'+id)
            .then((res) => {
                setPersonData(res.data)
                setState(states.DONE)
            })
            .catch(() => {
                setState(states.ERROR)
            })
    }, [])

    return (
        <>
            {
                state === states.LOADING && (
                    <h2><T id='loading'/></h2>
                )
            }

            {
                state === states.DONE && (
                    <div className="viewPerson">
                        <h1 className="name"><Jdenticon size="40px" value={personData.email} /> {personData.name}</h1>

                        <div className="summary">
                            <div className="item">
                                <div className="title"><T id='viewPerson.email'/>:</div>
                                <div className="value">{personData.email}</div>
                            </div>
                            <div className="item">
                                <div className="title"><T id='viewPerson.devicesCount'/>:</div>
                                <div className="value">{personData.devices.length}</div>
                            </div>
                            <div className="item">
                                <div className="title"><T id='viewPerson.lastActivity'/>:</div>
                                <div className="value">{formats.toHMSWords(new Date(personData.lastSeen))}</div>
                            </div>
                        </div>

                        <div className="table-wrapper">
                        <table className="table">
                            <thead>
                            <tr>
                                <th><T id='viewPerson.table.mac'/></th>
                                <th><T id='viewPerson.table.lastActivity'/></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>
                                    <div className="two-line">
                                        <div className="line">{faker.internet.mac()}</div>
                                        <div className="line light">{oui('20:37:06:12:34:56') || '-'}</div>
                                    </div>
                                </td>
                                <td>
                                    20min
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                )
            }

            {
                state === states.ERROR && (
                    <h1><T id='error'/></h1>
                )
            }
        </>
    )
}

export default BeaconView