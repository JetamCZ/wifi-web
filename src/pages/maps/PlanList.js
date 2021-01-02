import React, {createRef, useEffect, useState} from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import PlanView from "../../components/PlanView";
import Modal from "../../components/Modal";

const PlanList = () =>{
    const [data, setData] = useState(null)

    const [planViewId, setPlanViewId] = useState(null)
    const viewModal = createRef()

    useEffect(() => {
        AxiosInstance.get('/plans')
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
                    <th>Počet pater</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    data && data.map(plan =>
                        <tr>
                            <td>{plan.name}</td>
                            <td>{plan.floors.length}</td>
                            <td className="text-right">
                                <div className="btn sm" onClick={() => {
                                    setPlanViewId(plan._id)
                                    viewModal.current.open()
                                }}>Zobrazit plán</div>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>

            <Modal ref={viewModal}>
                <PlanView id={planViewId}/>
            </Modal>
        </>
    )
}

export default PlanList