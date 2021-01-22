import React from "react";
import Text from "../../components/Text";
import Format from "../../utils/formats";
import { Link } from "react-router-dom";

const Table = (props) => {
  return (
    <>
      <div className="devices-frame">
        {props.devices.map((device, index) => (
          <Link to={"/devices/" + device.mac} className="link-clear">
            <div className="device shadow">
              <div className="body">
                <div className="name">
                  {device.name ? (
                    device.name
                  ) : (
                    <span className="text-gray-400">
                      <Text id={"page-devices.table.unknown-name"}>
                        Neznámý název
                      </Text>
                    </span>
                  )}
                </div>
                <div className="mac">{device.mac}</div>

                <table className="rssi">
                  {device.lastSeens.map((seen) => (
                    <tr>
                      <td>{seen.deviceKey}</td>
                      <td>{Format.diff(new Date(seen.date))}</td>
                      <td>{seen.rssi} RSI</td>
                    </tr>
                  ))}
                </table>
              </div>

              <div className="bottom">
                <div className="vendor">
                  {device.vendor ? (
                    device.vendor.substr(0, 20) + "..."
                  ) : (
                    <span className="text-gray-400">
                      <Text id={"page-devices.table.unknown-vendor"}>
                        Neznámý výrobce
                      </Text>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/*
        <table className="table shadow">
            <thead>
            <tr>
                <th colSpan={3}></th>
                <th colSpan={4} className={"text-right"}><Text id='page-devices.table.lastUpdate'>Poslední update</Text>: {props.lastUpdate}</th>
            </tr>
            <tr>
                <th>#</th>
                <th><Text id={'page-devices.table.device'}>Název zařízení</Text></th>
                <th><Text id={'page-devices.table.mac'}>Mac adresa</Text></th>
                <th><Text id={'page-devices.table.vendor'}>Výrobce zařízení</Text></th>
                <th><Text id={'page-devices.table.rssi'}>RSSI</Text></th>
                <th><Text id={'page-devices.table.lastInfo'}>Poslední záznam</Text></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {
                props.devices.map((device, index) =>
                <tr key={device.mac}>
                    <td>{index + 1}</td>
                    <td>{device.name || <span className="text-gray-400"><Text id={'page-devices.table.unknown-name'}>Neznámý název</Text></span>}</td>
                    <td>{device.mac}</td>
                    <td>
                        {
                            device.vendor
                                ? device.vendor.substr(0, 20)+"..."
                                : <span className="text-gray-400"><Text id={'page-devices.table.unknown-vendor'}>Neznámý výrobce</Text></span>
                        }
                    </td>
                    <td>
                        {device.lastSeens.map(seen =>
                            <div style={{width: "100px"}}>
                                {seen.rssi} : {Format.diff(new Date(seen.date))}
                            </div>
                        )}
                    </td>
                    <td>
                        {Format.diff(new Date(device.lastSeenDate))}
                    </td>
                    <td>
                        <a href={'/devices/' + device.mac}><Text id='page-devices.table.viewDetail'>Zobrazit detail</Text></a>
                    </td>
                </tr>
            )}
            </tbody>
        </table>
        */}
    </>
  );
};

export default Table;
