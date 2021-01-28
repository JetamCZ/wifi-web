import React from "react"
import T from "../components/T"

const AuthLayout = (props) => {
    return (
        <div className="auth-bg">
            <div className="auth-layout">
                <h1>Locate.io</h1>
                <div className="content">{props.children}</div>
                <div className="sign">
                    <T id="components.authFooter.firstLine" />
                    <br />
                    <T id="components.authFooter.secondLine" /> - <span className="name">Matěj Půhoný</span> 2020 - {new Date().getFullYear()}
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
