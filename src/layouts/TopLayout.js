import React, { useState } from "react"
import T from "../components/T"
import { Link, useHistory } from "react-router-dom"
import Jdenticon from "react-jdenticon"
import UserController from "../controllers/UserController"

const TopLayout = (props) => {
    const auth = JSON.parse(window.localStorage.getItem("AUTH_USER"))

    const [menuOpen, setMenuOpen] = useState(false)

    let history = useHistory()

    if (!auth) {
        history.push("/auth")
        window.location.replace("/auth")
    }

    const logout = () => {
        UserController.logout()
        window.location.href = "/auth"
    }

    return (
        <div className="top-layout">
            <div className="main-nav">
                <div className="container nav-bar">
                    <Link to="/dashboard">
                        <div className="logo">
                            <div className="locatio">Locate.io</div>
                            <div className="org">{auth && auth.organization.name}</div>
                        </div>
                    </Link>

                    <div
                        className={menuOpen ? "menu mobile-open" : "menu mobile-close"}
                        onClick={() => setMenuOpen(false)}
                    >
                        <div className="item">
                            <Link to="/dashboard">
                                <T id="component.nav.dashboard" />
                            </Link>
                        </div>
                        <div className="item">
                            <Link to="/organization">
                                <T id="component.nav.organization" />
                            </Link>
                        </div>
                        <div className="item">
                            <Link to="/maps">
                                <T id="component.nav.maps" />
                            </Link>
                        </div>
                        {auth && (
                            <div className="item user">
                                <div className="avatar">
                                    {/*img src="https://i.pravatar.cc/100?u=120" alt="User"/>*/}
                                    <Jdenticon size="45px" value={auth.user.email} />
                                </div>
                                <div className="info">
                                    <div className="name">{auth.user.name}</div>
                                    <div className="nav-user">
                                        <Link to="/settings">
                                            <div className="nav-user-item">
                                                <T id="component.nav.settings" />
                                            </div>
                                        </Link>
                                        <div className="nav-user-item" onClick={logout}>
                                            <T id="component.nav.logout" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
                        <img src="/img/icons/menu.svg" alt="Menu icon" />
                    </div>
                </div>
            </div>

            {props.children}
        </div>
    )
}

export default TopLayout
