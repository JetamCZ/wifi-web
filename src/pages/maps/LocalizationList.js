import React, {createRef, useEffect, useState} from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import PlanView from "../../components/PlanView";
import Modal from "../../components/Modal";
import {Link} from "react-router-dom";

const LocalizationList = () =>{
    const [data, setData] = useState(null)

    const [planViewId, setPlanViewId] = useState(null)
    const viewModal = createRef()

    useEffect(() => {
        AxiosInstance.get('/localization')
            .then(res => {
                setData(res.data)
            })
    }, [])

    return (
        <>
            <table className="table">
                <thead>
                <tr>
                    <th>Název</th>
                    <th>Typ lokalizace</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    data && data.map(loc =>
                        <tr>
                            <td>{loc.name}</td>
                            <td>{loc.type}</td>
                            <td className="text-right">
                                <Link to={'/maps/'+loc._id}>
                                <div className="btn sm">Zobrazit</div>
                                </Link>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        </>
    )
}

export default LocalizationList