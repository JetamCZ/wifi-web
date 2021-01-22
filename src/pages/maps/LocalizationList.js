import React, { createRef, useEffect, useState } from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import Modal from "../../components/Modal";
import { Link } from "react-router-dom";
import AddLocalization from "../../components/AddLocalization";
import Toast from "../../utils/Toast";

const LocalizationList = () => {
  const [data, setData] = useState(null);
  const addModal = createRef();

  const [clicked, setClicked] = useState(0);

  useEffect(() => {
    update();
  }, []);

  const update = () => {
    AxiosInstance.get("/localization").then((res) => {
      setData(res.data);
    });
  };

  const handleClick = () => {
    setClicked(clicked + 1);

    if (clicked === 5) {
      AxiosInstance.post("/eastereggs/waldo").then(() => {
        update();
        Toast.fire({
          icon: "success",
          title: "You found easter egg! But where is Waldo?!",
        });
      });
    }
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th onClick={handleClick}>Název</th>
              <th>Typ lokalizace</th>
              <th className="text-right">
                <div
                  className="btn success sm"
                  onClick={() => addModal.current.open()}
                >
                  Přidat lokalizaci
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((loc) => (
                <tr>
                  <td>{loc.name}</td>
                  <td>{loc.type}</td>
                  <td className="text-right">
                    <Link to={"/maps/" + loc._id}>
                      <div className="btn sm">Zobrazit</div>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal ref={addModal}>
        <AddLocalization
          onSent={() => {
            update();
            addModal.current.close();
          }}
        />
      </Modal>
    </>
  );
};

export default LocalizationList;
