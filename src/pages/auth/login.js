import React, { useState } from "react"
import T from "../../components/T"
import Translations from "../../utils/Translations"
import { Link } from "react-router-dom"
import AxiosInstance from "../../utils/AxiosInstance"
import { useHistory } from "react-router-dom"
import UserController from "../../controllers/UserController"

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    let history = useHistory()

    const login = () => {
        AxiosInstance.post("/auth/login", { email, password })
            .then((res) => {
                UserController.login(res.data)
                history.push("/dashboard")
            })
            .catch((err) => {
                if (err?.response?.status === 400) {
                    setError(Translations.getId("page.auth.login.error.wrongCredentials"))
                    return
                }

                setError(Translations.getId("page.auth.login.error.tooManyRequests"))
            })
    }

    return (
        <div className="page-login">
            <h2>
                <T id="page.auth.login.title" />
            </h2>

            {error && <div className="error">{error}</div>}

            <label className="form-control">
                <div className="title">
                    <T id="page.auth.login.input.email" />
                </div>
                <input
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    autocomplete="email"
                    placeholder={Translations.getId("page.auth.login.input.email.placeholder")}
                />
            </label>

            <label className="form-control">
                <div className="title">
                    <T id="page.auth.login.input.password" />
                </div>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    autoComplete="current-password"
                    placeholder={Translations.getId("page.auth.login.input.password.placeholder")}
                />
            </label>

            <div className="text-right">
                <Link to="/auth/create-org">
                    <a className="btn">
                        <T id="page.auth.login.createOrg" />
                    </a>
                </Link>
                <span onClick={login} className="btn success">
                    <T id="page.auth.login.login" />
                </span>
            </div>
        </div>
    )
}

export default LoginPage
