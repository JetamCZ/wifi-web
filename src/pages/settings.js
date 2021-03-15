import React, {useState} from "react"
import UserController from "../controllers/UserController";
import AxiosInstance from "../utils/AxiosInstance";
import Toast from "../utils/Toast";

const Settings = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        name: "",
        email: ""
    })

    const send = () => {
        setLoading(true)

        AxiosInstance.put('/user/me', data)
            .then((res) => {
                setLoading(false)

                Toast.fire({
                    icon: "success",
                    title: "Uživatelská data uložena, změny se projeví po novém přihlášení."
                })
            })
            .catch((e) => {
                setLoading(false)

                if(e?.response?.status) {
                    Toast.fire({
                        icon: "error",
                        title: "Váš email už někdo využívá, nebo nesplňujete podmínku 3 znaků!"
                    })
                }


            })
    }

    return (
        <div className="page-settings container">
            <h1>Uživatel</h1>
            <div className="gap h-2"></div>

            <div className="cols cols-2">
                <label className="form-control">
                    <div className="title">Jméno</div>
                    <input type="text"
                           placeholder="Zadej jméno"
                           onChange={(e) => setData({...data, name: e.target.value})}
                           defaultValue={UserController.getUser().name}/>
                   <div className="hint">(min 3 znaky)</div>
                </label>
                <label className="form-control">
                    <div className="title">Email</div>
                    <input type="email"
                           placeholder="Zadej email"
                           onChange={(e) => setData({...data, email: e.target.value})}
                           defaultValue={UserController.getUser().email}/>
                    <div className="hint">(min 3 znaky)</div>
                </label>
            </div>

            <div className="text-right">
                {
                    loading ?
                        <div className="btn disabled">Uložit</div>
                        :
                        <div className="btn success" onClick={send}>Uložit</div>
                }

            </div>

        </div>
    )
}

export default Settings
