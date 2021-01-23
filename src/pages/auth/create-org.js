import React, { useState } from "react"
import T from "../../components/T"
import Translations from "../../utils/Translations"
import { Link } from "react-router-dom"
import AxiosInstance from "../../utils/AxiosInstance"
import { useHistory } from "react-router-dom"

const CreateOrg = () => {
    const [name, setName] = useState("")
    const [error, setError] = useState("")

    let history = useHistory()

    const register = () => {
        AxiosInstance.post("/auth/create-org", {
            name
        })
            .then((res) => {
                history.push("/auth/register/" + res.data.invCode)
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    if (error.response.data.errors[0].path === "name") {
                        setError(Translations.getId("page.auth.createNewOrg.error.pathNameError"))
                    }
                } else {
                    setError(Translations.getId("page.auth.login.error.tooManyRequests"))
                }
            })
    }

    return (
        <div className="page-createOrg">
            <h2>
                <T id="page.auth.createNewOrg.title" />
            </h2>

            {error && <div className="error">{error}</div>}

            <label className="form-control">
                <div className="title">
                    <T id="page.auth.createNewOrg.input.name" />
                </div>
                <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    placeholder={Translations.getId("page.auth.createNewOrg.input.name.placeholder")}
                />
            </label>

            <p>
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Duis pulvinar. Cras pede libero, dapibus nec,
                pretium sit amet, tempor quis.
            </p>

            <div className="text-right">
                <Link to="/auth">
                    <a className="btn">
                        <T id="page.auth.createNewOrg.backLogin" />
                    </a>
                </Link>
                <span className="btn success" onClick={register}>
                    <T id="page.auth.createNewOrg.createNewOrg" />
                </span>
            </div>
        </div>
    )
}

export default CreateOrg
