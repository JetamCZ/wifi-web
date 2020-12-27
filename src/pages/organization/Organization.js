import React, {createRef} from "react";
import T from "../../components/T";
import faker from "faker/locale/cz";
import Jdenticon from "react-jdenticon";
import oui from "oui";
import People from "./people";
import BeaconsList from "./BeaconsList";
import DeviceList from "./DevicesList";

const Organization = () => {
    return (
        <div className="page-organization container">
            <h1><T id="page.pageOrganization.members"/></h1>
            <People/>

            <h1><T id="page.pageOrganization.devices"/></h1>
            <DeviceList/>

            <h1><T id="page.pageOrganization.beacons"/></h1>
            <BeaconsList/>

        </div>
    )
}

export default Organization