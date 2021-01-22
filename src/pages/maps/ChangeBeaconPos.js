import React, { useEffect, useRef, useState } from "react";
import Map from "./plans/Map";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import T from "../../components/T";
import Modal from "../../components/Modal";

const ChangeBeaconsPos = (props) => {
  const states = {
    LOADING: 0,
    DONE: 1,
    ERROR: 2,
    DELETED: 3,
  };

  const [state, setState] = useState(states.LOADING);
  const [data, setData] = useState(null);
  const [modData, setModData] = useState(null);

  const [actBeacon, setActBeacon] = useState(null);

  const { id } = props;

  useEffect(() => {
    AxiosInstance.get("/localization/" + id)
      .then((res) => {
        setData(res.data);
        setModData(res.data);
        setActBeacon(res.data.beacons[0]);
        setState(states.DONE);
      })
      .catch(() => {
        setState(states.ERROR);
      });
  }, []);

  const changeFloor = (beaconId, floor) => {
    console.log("change floor", beaconId, floor);
    const newMod = { ...modData };
    newMod.beacons.find((beacon) => beacon._id === beaconId).f = floor;
    setModData(newMod);
    setData(newMod);
  };

  const getMapData = (d) => {
    const layers = { ...d }.floors;

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const beacons = data.beacons.filter((b) => b.f === layer.floor);

      layer.markers = [];

      beacons.forEach((b) => {
        layer.markers.push({
          xy: [b.y, b.x],
          color: "red",
          id: b._id,
          type: "beacon",
          popup: (
            <div className="mini-beaconView">
              <div className="title">
                <div className="name">{b.name}</div>
                <div className="key">{b.deviceKey}</div>
                <br />
                <div className="summary-title">Popis umístění:</div>
                <p>{b.desc || "..."}</p>
              </div>
            </div>
          ),
          dragEnd: (value) => {
            const newMod = { ...modData };
            newMod.beacons.find((beacon) => beacon._id === b._id).x =
              value.target._latlng.lng;
            newMod.beacons.find((beacon) => beacon._id === b._id).y =
              value.target._latlng.lat;
            setModData(newMod);
          },
          clicked: (e) => {
            setActBeacon(b);
          },
        });
      });

      delete layer._id;
    }

    return layers;
  };

  const save = () => {
    const saveData = { ...modData }.beacons;

    AxiosInstance.put("/localization/" + id + "/beacons", saveData).then(() => {
      props.afterSave();
    });
  };

  return (
    <div className="container edit-beacon-pos">
      {state === states.LOADING && (
        <h2>
          <T id="loading" />
        </h2>
      )}

      {state === states.DONE && (
        <>
          <h1 className="name">Úprava pozice majáků</h1>
          <p>Přesuň, jednotlivé body na mapě</p>

          {data.type === "NEAREST_FINGERPRINT" && (
            <p>
              Úprava bodů na mapě nemá vliv na určování polohy zařízení.
              (fingerprinty nelze automaticky opravit)
            </p>
          )}

          <div className="gap h-2"></div>

          <Map layers={getMapData(data.plan)} changingPos />

          {actBeacon && (
            <div className="act-beacon">
              <h3>{actBeacon.name}</h3>
              <p>{actBeacon.desc}</p>

              {data.plan.floors.map((lay) => (
                <div
                  className="btn sm warning"
                  onClick={() => changeFloor(actBeacon._id, lay.floor)}
                >
                  Přesunout do: {lay.name}
                </div>
              ))}
            </div>
          )}

          <br />

          <div className="text-right">
            <div className="btn success" onClick={save}>
              Uložit pozici majáků
            </div>
          </div>
        </>
      )}

      {state === states.ERROR && (
        <h1>
          <T id="error" />
        </h1>
      )}

      {state === states.DELETED && (
        <h1>
          <T id="viewBeacon.deleted" />
        </h1>
      )}
    </div>
  );
};

export default ChangeBeaconsPos;
