import React, { useState } from "react"
import T from "../../components/T"
import Translations from "../../utils/Translations"
import { Link } from "react-router-dom"
import AxiosInstance from "../../utils/AxiosInstance"
import { useHistory } from "react-router-dom"
import QRcodeInput from "../../components/QRcodeInput";

const CreateOrg = () => {
    const [data, setData] = useState({
        name: "",
        regKey: ""
    })
    const [error, setError] = useState("")

    let history = useHistory()

    const register = () => {
        AxiosInstance.post("/auth/create-org", data)
            .then((res) => {
                history.push("/auth/register/" + res.data.invCode)
            })
            .catch((error) => {
                if(error.response.status === 400) {
                    if (error?.response?.data?.errors[0]?.path === "name") {
                        setError(Translations.getId("page.auth.createNewOrg.error.pathNameError"))
                    }
                } else if(error.response.status === 403) {
                    setError(Translations.getId("page.auth.createNewOrg.error.code"))
                } else if(error.response.status === 429) {
                    setError(Translations.getId("page.auth.login.error.tooManyRequests"))
                } else {
                    setError(Translations.getId("page.auth.createNewOrg.error.serverError"))
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
                    onChange={(e) => setData({...data, name: e.target.value})}
                    placeholder={Translations.getId("page.auth.createNewOrg.input.name.placeholder")}
                />
            </label>

            <label className="form-control">
                <div className="title">
                    <T id="page.auth.createNewOrg.input.regKey" />
                </div>
                <QRcodeInput placeholder="Zadejte registrační klíč"
                             onChange={(e) => setData({...data, regKey: e})}/>
            </label>

            <p>
                K registraci je zapotřebí registrační klíč. (Pokud potřebuje vytvořit registrační klíč kontaktujete nás na emailu: <b>info@puhony.eu</b>)
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
