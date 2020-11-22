import React from 'react';
import './css/normalize.css';
import './css/main.scss';
import Dashboard from "./pages/dashboard";

import './css/animations/all.scss';
import MainLayout from "./layouts/main";
import './css/animate.min.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Text from "./components/Text";
import Devices from "./pages/devices";
import Error404 from "./pages/404";
import Beacons from "./pages/beacons";
import Device from "./pages/device";
import Settings from "./pages/settings";
import Maps from "./pages/maps/maps";
import BigMap from "./pages/maps/BigMap";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/dashboard">
                    <MainLayout title={<Text id={'menu.dashboard'}>Dashboard</Text>}>
                        <Dashboard/>
                    </MainLayout>
                </Route>
                <Route path="/settings">
                    <MainLayout title={<Text id={'menu.settings'}>Nastavení</Text>}>
                        <Settings/>
                    </MainLayout>
                </Route>
                <Route path="/devices/:macAddress">
                    <MainLayout title={<Text id={'menu.devices'}>Zařízení</Text>}>
                        <Device/>
                    </MainLayout>
                </Route>
                <Route path="/devices">
                    <MainLayout title={<Text id={'menu.devices'}>Zařízení</Text>}>
                        <Devices/>
                    </MainLayout>
                </Route>
                <Route path="/beacons">
                    <MainLayout title={<Text id={'menu.beacons'}>Majáky</Text>}>
                        <Beacons/>
                    </MainLayout>
                </Route>
                <Route exact path="/">
                    <Redirect to='/dashboard'/>
                </Route>
                <Route path="/maps">
                    <MainLayout title={<Text id={'menu.maps'}>Maps</Text>}>
                        <Maps/>
                    </MainLayout>
                </Route>
                <Route path="/map/:id/print/:mac">

                </Route>
                <Route path="/map/:id">
                    <BigMap/>
                </Route>
                <Route path='*'>
                    <Error404/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
