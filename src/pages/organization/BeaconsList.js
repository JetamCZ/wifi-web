import React, { createRef, useEffect, useState } from "react";
import faker from "faker/locale/cz";
import Modal from "../../components/Modal";
import T from "../../components/T";
import AxiosInstance from "../../utils/AxiosInstance";
import formats from "../../utils/formats";
import Translations from "../../utils/Translations";
import ViewBeacon from "../../components/viewBeacon";
import QRcodeInput from "../../components/QRcodeInput";
import Toast from "../../utils/Toast";
import Format from "../../utils/formats";

const BeaconsList = () => {
  const [newBeacon, setNewBeacon] = useState({
    deviceKey: "",
    name: "",
    desc: "",
  });

  const [beacons, setBeacons] = useState(null);

  const setFormValue = (property, value) => {
    const newData = { ...newBeacon };

    newData[property] = value;

    setNewBeacon(newData);
  };

  const modal = createRef();
  const viewModal = createRef();

  const [viewBeaconId, setViewBeaconId] = useState(null);

  const createBeacon = () => {
    AxiosInstance.post("/beacons", newBeacon)
      .then((res) => {
        modal.current.close();
        getBeacons();
      })
      .catch((err) => {
        if (err?.response?.status === 400) {
          Toast.fire({
            icon: "error",
            title: "Organizace již má přiřazený maják s tímto kódem!",
          });
        }
      });
  };

  const getBeacons = () => {
    AxiosInstance.get("/beacons").then((res) => {
      setBeacons(res.data);
    });
  };

  useEffect(() => {
    getBeacons();
    const int = setInterval(getBeacons, 5000);

    return function cleanup() {
      clearInterval(int);
    };
  }, []);

  const openView = (id) => {
    setViewBeaconId(id);
    viewModal.current.open();
  };

  const getStatus = (beacon) => {
    const s = Format.diffInSeconds(new Date(beacon.lastSeenDate));

    if (s <= 15) {
      return <div className="status online">Online</div>;
    } else if (s <= 60) {
      return <div className="status warning">Loosing</div>;
    }

    return <div className="status offline">Offline</div>;
  };

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>
                <T id="page.pageOrganization.beacons.name" />
              </th>
              <th>
                <T id="page.pageOrganization.beacons.desc" />
              </th>
              <th>
                <T id="page.pageOrganization.beacons.lastActivity" />
              </th>
              <th></th>
              <th className="text-right">
                <div
                  className="btn sm success"
                  onClick={() => {
                    modal.current.open();
                  }}
                >
                  <T id="page.pageOrganization.beacons.addBeacon" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {beacons &&
              beacons.map((beacon, index) => (
                <tr>
                  <td>
                    <div className="two-line">
                      <div className="line">{beacon.name}</div>
                      <div className="line light">{beacon.deviceKey}</div>
                    </div>
                  </td>
                  <td>{beacon.desc}</td>
                  <td>
                    {beacon.lastSeenDate
                      ? formats.toHMSWords(new Date(beacon.lastSeenDate))
                      : Translations.getId(
                          "page.pageOrganization.beacons.neverSeen"
                        )}
                  </td>
                  <td>{getStatus(beacon)}</td>
                  <td className="text-right">
                    <div
                      className="btn sm"
                      onClick={() => openView(beacon._id)}
                    >
                      zobrazit maják
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
          {/*
                <tfoot>
                <tr>
                    <th colSpan="3" className="text-right">
                        <div className="btn sm success">1</div>
                    </th>
                </tr>
                </tfoot>
                */}
        </table>
      </div>

      <Modal ref={viewModal}>
        <ViewBeacon id={viewBeaconId} refresh={getBeacons} />
      </Modal>

      <Modal ref={modal}>
        <h1>
          <T id="page.pageOrganization.beacons.addModal.title" />
        </h1>
        <p>
          <T id="page.pageOrganization.beacons.addModal.desc" />
        </p>

        <div className="gap h-2"></div>

        <label className="form-control">
          <div className="title">Device key majáku</div>
          <QRcodeInput
            placeholder="Zadej device key"
            onChange={(code) => setFormValue("deviceKey", code)}
          />
        </label>

        <label className="form-control">
          <div className="title">Název (jakékoli pojmenování)</div>
          <input
            type="text"
            placeholder="Zadej název"
            onChange={(e) => setFormValue("name", e.target.value)}
          />
        </label>

        <label className="form-control">
          <div className="title">Popis umístění</div>
          <input
            type="text"
            placeholder="Zadej popis umístění majáku"
            onChange={(e) => setFormValue("desc", e.target.value)}
          />
        </label>

        <div className="text-right">
          {newBeacon.name && newBeacon.deviceKey ? (
            <div className="btn success" onClick={createBeacon}>
              Přidat maják
            </div>
          ) : (
            <div className="btn disabled">Přidat maják</div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default BeaconsList;
