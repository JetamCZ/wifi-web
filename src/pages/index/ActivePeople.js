import T from "../../components/T";
import faker from "faker/locale/cz";
import React, {useEffect, useState} from "react";
import Jdenticon from "react-jdenticon";
import AxiosInstance from "../../utils/AxiosInstance";
import formats from "../../utils/formats";

const ActivePeople = () => {
    const [people, setPeople] = useState()
    const [int, setInt] = useState(null)

    const update = () => {
        AxiosInstance.get('/organization/people')
            .then((res) => {
                setPeople(res.data)
            })
    }

    useEffect(() => {
        update()

        const interval = setInterval(update, 5000)

        return function cleanup() {
            clearInterval(interval)
        }
    }, [])

    return (
        <div className="com-activePeople">
            <h1><T id="page.pageIndex.activePeople"/></h1>
            <div className="people">
                {
                    people && people.map(person =>
                        <div className="person">
                            <div className="avatar">
                                <Jdenticon size="50px" value={person.email} />
                            </div>
                            <div className="info">
                                <div className="name">{person.name}</div>
                                <div className="desc">
                                    <T id='page.pageIndex.activePeople.lastActivity'/> {" "}
                                    <span className="time">
                                        {person.lastSeen ? formats.toHMSWords(new Date(person.lastSeen)) : '?'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ActivePeople