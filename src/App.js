import React from "react"

import "./css/normalize.css"
import "./css/main.scss"
import "./css/main.scss"
import "css-tooltip"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Error404 from "./pages/404"
import Settings from "./pages/settings"
import DashBoard from "./pages/Dashboard/dashboard"
import AuthLayout from "./layouts/AuthLayout"
import CreateOrg from "./pages/auth/create-org"
import LoginPage from "./pages/auth/login"
import Register from "./pages/auth/register"
import Organization from "./pages/organization/Organization"
import CssPlayground from "./pages/css-playground"
import MapList from "./pages/maps/MapList"
import LocalizationView from "./pages/maps/LocalizationView"
import Docs from "./pages/docs"
import HomePage from "./pages/homepage"
import BlueLayout from "./layouts/BlueLayout"
import MapPlayground from "./pages/MapPlayground"
import History from "./pages/history/history";
import config from "./config"

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <HomePage />
                </Route>

                {
                    !config.SCHOOL_PROMO && (
                        <>
                            <Route path="/dashboard">
                                <BlueLayout title="Dashboard">
                                    <DashBoard />
                                </BlueLayout>
                            </Route>

                            <Route path="/organization">
                                <BlueLayout title="Organizace">
                                    <Organization />
                                </BlueLayout>
                            </Route>

                            <Route path="/css">
                                <BlueLayout title="CSS playground">
                                    <CssPlayground />
                                </BlueLayout>
                            </Route>

                            <Route path="/map-playground">
                                <BlueLayout title="MAP playground">
                                    <MapPlayground />
                                </BlueLayout>
                            </Route>

                            <Route path="/settings">
                                <BlueLayout title={"Nastavení"}>
                                    <Settings />
                                </BlueLayout>
                            </Route>

                            <Route path="/localizations/:id">
                                <LocalizationView />
                            </Route>

                            <Route path="/localizations">
                                <BlueLayout title="Lokalizace">
                                    <MapList />
                                </BlueLayout>
                            </Route>

                            <Route path="/history">
                                <BlueLayout title="Status majáků">
                                    <History/>
                                </BlueLayout>
                            </Route>


                            <Route path="/auth/create-org">
                                <AuthLayout>
                                    <CreateOrg />
                                </AuthLayout>
                            </Route>

                            <Route path="/auth/register/:code">
                                <AuthLayout>
                                    <Register />
                                </AuthLayout>
                            </Route>

                            <Route path="/auth">
                                <AuthLayout>
                                    <LoginPage />
                                </AuthLayout>
                            </Route>
                        </>
                    )
                }

                <Route path="/docs">
                    <Docs />
                </Route>

                <Route path="*">
                    <Error404 />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
