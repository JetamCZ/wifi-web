import React, { useEffect, useState } from "react";
import AxiosInstance from "../utils/AxiosInstance";
import T from "./T";
import Jdenticon from "react-jdenticon";
import formats from "../utils/formats";
import oui from "oui";

const ViewPerson = (props) => {
  const { id } = props;

  const states = {
    LOADING: 0,
    DONE: 1,
    ERROR: 2,
    DELETED: 3,
  };

  const [state, setState] = useState(states.LOADING);
  const [personData, setPersonData] = useState();

  useEffect(() => {
    update();
  }, []);

  const update = () => {
    AxiosInstance.get("/organization/person/" + id)
      .then((res) => {
        setPersonData(res.data);
        setState(states.DONE);
      })
      .catch(() => {
        setState(states.ERROR);
      });
  };

  const remove = () => {
    AxiosInstance.delete("/organization/person/" + id).then(() => {
      setState(states.DELETED);

      if (props.refresh) {
        props.refresh();
      }
    });
  };

  const deleteDevice = (id) => {
    AxiosInstance.delete("/devices/" + id).then(() => {
      update();
    });
  };

  return (
    <>
      {state === states.LOADING && (
        <h2>
          <T id="loading" />
        </h2>
      )}

      {state === states.DONE && (
        <div className="viewPerson">
          <h1 className="name">
            <Jdenticon size="40px" value={personData.email} /> {personData.name}
          </h1>

          <div className="summary">
            <div className="item">
              <div className="title">
                <T id="viewPerson.email" />:
              </div>
              <div className="value">{personData.email}</div>
            </div>
            <div className="item">
              <div className="title">
                <T id="viewPerson.devicesCount" />:
              </div>
              <div className="value">{personData.devices.length}</div>
            </div>
            <div className="item">
              <div className="title">
                <T id="viewPerson.lastActivity" />:
              </div>
              <div className="value">
                {personData.lastSeen
                  ? formats.toHMSWords(new Date(personData.lastSeen))
                  : "?"}
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <T id="viewPerson.table.mac" />
                  </th>
                  <th>
                    <T id="viewPerson.table.name" />
                  </th>
                  <th>
                    <T id="viewPerson.table.lastActivity" />
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {personData.devices.map((device) => (
                  <tr>
                    <td>
                      <div className="two-line">
                        <div className="line">{device.mac}</div>
                        <div className="line light">
                          {oui(device.mac) || "-"}
                        </div>
                      </div>
                    </td>
                    <td>{device.name}</td>
                    <td>
                      {device.lastSeenDate && (
                        <>
                          {formats.toDMYHMS(new Date(device.lastSeenDate))} (
                          {formats.toHMSWords(new Date(device.lastSeenDate))})
                        </>
                      )}
                    </td>
                    <td>
                      <div
                        className="btn danger sm"
                        onClick={() => deleteDevice(device._id)}
                      >
                        <img
                          src={"/img/icons/white/trash.svg"}
                          alt="Trash icon"
                        />
                        <T id="viewPerson.removeDevice" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tools">
            {/*
                            <div className="item">
                                <img src={'/img/icons/edit.svg'} alt="Edit icon"/>
                                Editovat maják
                            </div>
                            */}
            <div className="item" onClick={remove}>
              <img src={"/img/icons/trash.svg"} alt="Trash icon" />
              <T id="viewPerson.removeBtn" />
            </div>
          </div>
        </div>
      )}

      {state === states.ERROR && (
        <h1>
          <T id="error" />
        </h1>
      )}

      {state === states.DELETED && (
        <h1>
          <T id="viewPerson.deleted" />
        </h1>
      )}
    </>
  );
};

export default ViewPerson;
