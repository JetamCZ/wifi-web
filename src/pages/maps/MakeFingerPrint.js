import React, {createRef, useEffect, useRef, useState} from "react";
import Map from "./plans/Map";
import { useParams } from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import T from "../../components/T";
import Modal from "../../components/Modal";
import faker from "faker/locale/cz";
import formats from "../../utils/formats";
import Marker from "./plans/Marker";
import moveIcon from "./plans/icons/moveIcon";

let interval = null;

const MakeFingerPrint = (props) => {
  const states = {
    LOADING: 0,
    DONE: 1,
    ERROR: 2,
    DELETED: 3,
  };

  const progressStates = {
    SELECT_DEVICE: 0,
    SELECTING_PLACE: 1,
    GETTING_DATA: 2,
    SENDING_DATA: 3,
  };

  const selectRef = useRef();

  const [state, setState] = useState(states.LOADING);
  const [data, setData] = useState(null);
  const [fingerPrintData, setFingerPrintData] = useState([]);

  const [progress, setProgress] = useState(progressStates.SELECT_DEVICE);

  const [devices, setDevices] = useState([]);

  const [point, setPoint] = useState({
    mac: "",
    x: 0,
    y: 0,
    f: 0,
  });

  const map = createRef()

  const { id } = props;

  useEffect(() => {
    AxiosInstance.get("/devices").then((res) => {
      setDevices(res.data);
    });

    AxiosInstance.get("/localization/" + id)
      .then((res) => {
        setData(res.data);
        setState(states.DONE);
      })
      .catch(() => {
        setState(states.ERROR);
      });
  }, []);

  const changeFloor = (floor) => {
    setPoint({ ...point, f: floor });
  };

  const selectDevice = () => {
    setPoint({ ...point, mac: selectRef.current.value });
    setProgress(progressStates.SELECTING_PLACE);
  };

  const getMapData = (d) => {
    const layers = { ...d }.floors;

    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];

      layer.markers = [];

      delete layer._id;
    }

    return layers;
  };

  const updateFingerPrintData = () => {
    AxiosInstance.get("/localization/" + id + "/fingerprint/" + point.mac).then(
      (res) => {
        let newData = res.data[point.mac]?.meets || [];
        let expDate = new Date();
        expDate = expDate.setSeconds(expDate.getSeconds() - 30);

        //newData = newData.filter((meet) => new Date(meet.date) >= expDate)

        setFingerPrintData(newData);
      }
    );
  };

  const save = () => {
    setProgress(progressStates.GETTING_DATA);

    updateFingerPrintData();
    interval = setInterval(updateFingerPrintData, 2000);
  };

  const send = () => {
    setProgress(progressStates.SENDING_DATA);
    clearInterval(interval);

    const beaconSendData = fingerPrintData.map((meet) => {
      return {
        deviceKey: meet.deviceKey,
        rssi: meet.rssi,
      };
    });

    const dataSend = { ...point, beacons: beaconSendData };

    AxiosInstance.post("/localization/" + id + "/fingerprint", dataSend).then(
      (res) => {
        props.afterSave();
      }
    );
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
          {progressStates.SELECT_DEVICE === progress && (
            <>
              <h1 className="name">Přidání fingerprintu</h1>
              <p>Vyber zařízení, u kterého cheš zaznamenat pozici</p>

              <label className="form-control">
                <div className="title">Zažízení</div>
                <select ref={selectRef}>
                  {devices.map((device) => (
                    <option value={device.mac}>
                      {device.name} ({device.mac})
                    </option>
                  ))}
                </select>
              </label>

              <br />
              <div className="text-right">
                <div className="btn success" onClick={selectDevice}>
                  Potvrdit výběr zařízení(1/3)
                </div>
              </div>
            </>
          )}
          {progressStates.SELECTING_PLACE === progress && (
            <>
              <h1 className="name">Přidání fingerprintu</h1>
              <p>Přesuň, bod na místo kde se reálně nachází zařízení!</p>

              <div className="gap h-2"></div>

              <Map layers={getMapData(data.plan)} ref={map}>
                <Marker mapRef={map} pos={[point.x, point.y, point.f]} icon={moveIcon} draggable={true} dragend={(value) => {
                  setPoint({
                    ...point,
                    x: value.target._latlng.lng,
                    y: value.target._latlng.lat,
                  });
                }}/>
              </Map>

              <div className="act-beacon">
                <h3>Nový fingerprint ({point.mac})</h3>
                <p></p>
                {data.plan.floors.map((lay) => (
                  <div
                    className="btn sm warning"
                    onClick={() => changeFloor(lay.floor)}
                  >
                    Přesunout do: {lay.name}
                  </div>
                ))}
              </div>

              <br />

              <div className="text-right">
                <div className="btn success" onClick={save}>
                  Nastavit pozici zařízení (2/3)
                </div>
              </div>
            </>
          )}
          {progressStates.GETTING_DATA === progress && (
            <>
              <h1 className="name">
                Získavají se síli signálů od jednotlivých majáků
              </h1>
              <p>
                Toto může chvíli trvat, je zapotřebí mít signál minimálně od 3
                majáků. (pokud lokalizace nemá přiřazené 3 majáky tak je
                zapotřebí mít signál ke všem přiřazeným majkákům)
              </p>

              <table className="table">
                <thead>
                  <tr>
                    <th>Beacon</th>
                    <th>Síla signálu</th>
                    <th>Poslední záznam</th>
                  </tr>
                </thead>
                <tbody>
                  {fingerPrintData &&
                    data.beacons.map((beacon) => {
                      const b = fingerPrintData.find(
                        (meet) => meet.deviceKey === beacon.deviceKey
                      );

                      let rssi = "?";

                      if (b) {
                        rssi = b.rssi;
                      }

                      return (
                        <tr>
                          <td>
                            <div className="two-line">
                              <div className="line">{beacon.name}</div>
                              <div className="line light">
                                {beacon.deviceKey}
                              </div>
                            </div>
                          </td>
                          <td>{rssi} db</td>
                          <td>
                            {b?.date &&
                              "před " + formats.toHMSWords(new Date(b.date))}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <div className="gap h-2"></div>

              <div className="text-right">
                {fingerPrintData.length >= 2 ||
                fingerPrintData.length === data.beacons.length ? (
                  <div className="btn success" onClick={send}>
                    Odeslat data (3/3)
                  </div>
                ) : (
                  <div className="btn info disabled">Odeslat data (3/3)</div>
                )}
              </div>
            </>
          )}
          {progressStates.SENDING_DATA === progress && (
            <>
              <h1 className="name">Odesílání fingerprintu</h1>
            </>
          )}
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

export default MakeFingerPrint;
