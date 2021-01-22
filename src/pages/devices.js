import React, { useEffect, useState } from "react";
import Text from "../components/Text";
import AxiosInstance from "../utils/AxiosInstance";
import Format from "../utils/formats";
import setHeader from "../utils/setHeader";
import Table from "./devices/table";
import Breadcrumbs from "../components/Breadcrumbs";
import Skeleton from "@material-ui/lab/Skeleton";

const Devices = () => {
  const [data, setData] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");
  const [dataError, setDataError] = useState(false);

  setHeader("Devices");

  useEffect(() => {
    update();
    const interval = setInterval(update, 3000);

    return function cleanup() {
      clearInterval(interval);
    };
  }, []);

  const update = () => {
    AxiosInstance.get("devices")
      .then((response) => {
        let data = response.data;

        data = data.sort((a, b) => {
          return a.mac > b.mac ? 1 : 1;
        });

        setData(data);
        setDataError(false);
        setLastUpdate(Format.time(new Date()));
      })
      .catch(() => {
        setDataError(true);
      });
  };

  const selected = [
    "e0:d0:83:d6:2a:57", //Matěj Telefon
    "58:00:e3:ca:99:01", //Matěj NTB
    "3c:dc:bc:97:f2:29", //Alenka mobil
  ];

  const samsung = false;

  return (
    <div className="page-devices w-page-1000">
      <Breadcrumbs
        items={[{ href: "", item: <Text id={"menu.devices"}>Zařízení</Text> }]}
      />

      {data ? (
        <>
          <h2>
            <Text id="device-page.selected-devices">Vybraná zařízení</Text>
          </h2>
          <Table
            devices={data.filter(
              (device) =>
                selected.includes(device.mac) ||
                selected.includes(device.name) ||
                (samsung && device.vendor && device.vendor.includes("Samsung"))
            )}
            lastUpdate={lastUpdate}
          />

          <h2>
            <Text id="device-page.all-devices">Všechna zařízení</Text>
          </h2>
          <Table devices={data} lastUpdate={lastUpdate} />
        </>
      ) : (
        <div className="w-page-1000">
          {/*<Loading isError={dataError}/>*/}

          <div className="devices-frame">
            {[...Array(3)].map(() => (
              <div className="device shadow">
                <div className="body">
                  <div className="name">
                    <Skeleton animation="wave" width={100} height={30} />
                  </div>
                  <div className="mac">
                    <Skeleton animation="wave" width={200} />
                  </div>

                  <table className="rssi">
                    <tr>
                      <td>
                        <Skeleton animation="wave" width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton animation="wave" width={40} height={15} />
                      </td>
                      <td>
                        <Skeleton animation="wave" width={40} height={15} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Skeleton animation="wave" width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton animation="wave" width={40} height={15} />
                      </td>
                      <td>
                        <Skeleton animation="wave" width={40} height={15} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <Skeleton animation="wave" width={80} height={15} />
                      </td>
                      <td>
                        <Skeleton animation="wave" width={40} height={15} />
                      </td>
                      <td>
                        <Skeleton animation="wave" width={40} height={15} />
                      </td>
                    </tr>
                  </table>
                </div>

                <div className="bottom">
                  <div className="vendor">
                    <Skeleton animation="wave" width={250} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Devices;
