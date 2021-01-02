import React from 'react';
import './css/normalize.css';
import './css2/main.scss';

import './css/animations/all.scss';
import './css/animate.min.css';

import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Error404 from "./pages/404";
import TopLayout from "./layouts/TopLayout";
import Settings from "./pages/settings";
import DashBoard from "./pages/dashboard";
import AuthLayout from "./layouts/AuthLayout";
import CreateOrg from "./pages/auth/create-org";
import LoginPage from "./pages/auth/login";
import Register from "./pages/auth/register";
import Organization from "./pages/organization/Organization";
import CssPlayground from "./pages/css-playground";
import MapList from "./pages/maps/MapList";
import LocalizationView from "./pages/maps/LocalizationView";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <TopLayout>
                        <DashBoard/>
                    </TopLayout>
                </Route>

                <Route path="/organization">
                    <TopLayout>
                        <Organization/>
                    </TopLayout>
                </Route>

                <Route path="/css">
                    <TopLayout>
                        <CssPlayground/>
                    </TopLayout>
                </Route>

                <Route path="/settings">
                    <TopLayout>
                        <Settings/>
                    </TopLayout>
                </Route>

                <Route path="/maps/:id">
                    <TopLayout>
                        <LocalizationView/>
                    </TopLayout>
                </Route>

                <Route path="/maps">
                    <TopLayout>
                        <MapList/>
                    </TopLayout>
                </Route>

                {/*
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
                */}
                <Route path="/auth/create-org">
                    <AuthLayout>
                        <CreateOrg/>
                    </AuthLayout>
                </Route>

                <Route path="/auth/register/:code">
                    <AuthLayout>
                        <Register/>
                    </AuthLayout>
                </Route>

                <Route path="/auth">
                    <AuthLayout>
                        <LoginPage/>
                    </AuthLayout>
                </Route>

                <Route path='*'>
                    <Error404/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
