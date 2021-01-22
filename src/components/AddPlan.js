import React, { useRef, useState } from "react";
import Modal from "./Modal";
import AddPlanFloor from "./AddPlanFloor";
import AxiosInstance from "../utils/AxiosInstance";

const AddPlan = (props) => {
  const [data, setData] = useState({ name: "" });
  const [floors, setFloors] = useState([]);

  const [sending, setSending] = useState(false);

  const addPlanFloorRef = useRef();

  const reformatFloors = (fs) => {
    const newFloors = fs || [...floors];

    newFloors.forEach((floor, index) => {
      floor.floor = index;
    });

    setFloors(newFloors);
  };

  const removeFloor = (num) => {
    const newFloors = [...floors].filter((f) => f.floor !== num);

    setFloors(newFloors);
    reformatFloors(newFloors);
  };

  const addFloor = (data) => {
    addPlanFloorRef.current.close();

    const newFloors = [...floors];

    newFloors.push(data);
    setFloors(newFloors);
    reformatFloors(newFloors);
  };

  const createPlan = () => {
    setSending(true);

    AxiosInstance.post("/plans", { floors, name: data.name })
      .then(() => {
        props.callback();
      })
      .finally(() => {
        setSending(false);
      });
  };

  return (
    <div className="addPlan-modal">
      <h1>Přidání nového plánu</h1>
      <p></p>

      <label className="form-control">
        <div className="title">Název plánu</div>
        <input
          type="text"
          placeholder="Zadej název plánu"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </label>

      <div className="floors">
        {floors.map((floor) => (
          <div className="floor">
            <img src={floor.image} alt="" className="floor-img" />

            <div className="name">{floor.name}</div>

            <div
              className="close-btn"
              onClick={() => removeFloor(floor.floor)}
            ></div>
          </div>
        ))}
        {floors.length === 0 && (
          <div className="text-center">Přidej více pater!</div>
        )}
        <div className="text-center">
          <div
            className="btn success"
            onClick={() => addPlanFloorRef.current.open()}
          >
            <img src="/img/icons/white/plus-circle.svg" alt="" />
            Přidat patro
          </div>
        </div>
      </div>

      <div className="text-right">
        {floors.length > 0 && data.name && !sending ? (
          <div className="btn success" onClick={createPlan}>
            Přidat plán
          </div>
        ) : (
          <div className="btn disabled">Přidat plán</div>
        )}
      </div>

      <Modal ref={addPlanFloorRef}>
        <AddPlanFloor callBack={addFloor} />
      </Modal>
    </div>
  );
};

export default AddPlan;
