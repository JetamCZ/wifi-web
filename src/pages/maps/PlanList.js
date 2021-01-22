import React, { createRef, useEffect, useState } from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import PlanView from "../../components/PlanView";
import Modal from "../../components/Modal";
import AddPlan from "../../components/AddPlan";

const PlanList = () => {
  const [data, setData] = useState(null);

  const [planViewId, setPlanViewId] = useState(null);
  const viewModal = createRef();
  const addPlanModal = createRef();

  useEffect(() => {
    update();
  }, []);

  const update = () => {
    AxiosInstance.get("/plans").then((res) => {
      setData(res.data);
    });
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Název</th>
              <th>Počet pater</th>
              <th className="text-right">
                <div
                  className="btn success sm"
                  onClick={() => addPlanModal.current.open()}
                >
                  Přidat plán
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((plan) => (
                <tr>
                  <td>{plan.name}</td>
                  <td>{plan.floors.length}</td>
                  <td className="text-right">
                    <div
                      className="btn sm"
                      onClick={() => {
                        setPlanViewId(plan._id);
                        viewModal.current.open();
                      }}
                    >
                      Zobrazit plán
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal ref={viewModal}>
        <PlanView
          id={planViewId}
          update={() => {
            update();
            viewModal.current.close();
          }}
        />
      </Modal>

      <Modal ref={addPlanModal}>
        <AddPlan
          callback={() => {
            update();
            addPlanModal.current.close();
          }}
        />
      </Modal>
    </>
  );
};

export default PlanList;
