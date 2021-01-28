import React from "react"

import "./css/normalize.css"
import "./css/main.scss"
import "./css/main.scss"

import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import TopLayout from "./layouts/TopLayout"

import Error404 from "./pages/404"
import Settings from "./pages/settings"
import DashBoard from "./pages/dashboard"
import AuthLayout from "./layouts/AuthLayout"
import CreateOrg from "./pages/auth/create-org"
import LoginPage from "./pages/auth/login"
import Register from "./pages/auth/register"
import Organization from "./pages/organization/Organization"
import CssPlayground from "./pages/css-playground"
import MapList from "./pages/maps/MapList"
import LocalizationView from "./pages/maps/LocalizationView"
import Docs from "./pages/docs";
import HomePage from "./pages/homepage";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <HomePage/>
                </Route>
                <Route path="/dashboard" exact>
                    <TopLayout>
                        <DashBoard />
                    </TopLayout>
                </Route>

                <Route path="/organization">
                    <TopLayout>
                        <Organization />
                    </TopLayout>
                </Route>

                <Route path="/css">
                    <TopLayout>
                        <CssPlayground />
                    </TopLayout>
                </Route>

                <Route path="/settings">
                    <TopLayout>
                        <Settings />
                    </TopLayout>
                </Route>

                <Route path="/maps/:id">
                    <TopLayout>
                        <LocalizationView />
                    </TopLayout>
                </Route>

                <Route path="/maps">
                    <TopLayout>
                        <MapList />
                    </TopLayout>
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

                <Route path="/docs">
                    <Docs/>
                </Route>

                <Route path="*">
                    <Error404 />
                </Route>
            </Switch>
        </Router>
    )
}

export default App
