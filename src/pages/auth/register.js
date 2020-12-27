import React, {useEffect, useState} from "react";
import T from "../../components/T";
import Translations from "../../utils/Translations";
import {Link} from "react-router-dom";
import AxiosInstance from "../../utils/AxiosInstance";
import {useParams} from "react-router-dom"
import UserController from "../../controllers/UserController";

const Register = () => {
    const { code } = useParams()

    const [codeVerify, setCodeVerify] = useState(false)

    const [error, setError] = useState("")

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [passwd, setPasswd] = useState("")
    const [passwdAgain, setPasswdAgain] = useState("")

    useEffect(() => {
        AxiosInstance.get('/auth/verify-code/'+code)
            .catch(() => {
                setCodeVerify(code)
            })
    }, [])

    const register = () => {
        if(passwd !== passwdAgain) {
            setError(Translations.getId('page.auth.register.error.passwdAgain'))
            return
        }

        setError("")

        AxiosInstance.post('/auth/register', {
            invCode: code,
            name,
            email,
            password: passwd
        })
            .then(res => {
                UserController.login(res.data.token)
                window.location.href = "/"
            })
            .catch(err =>{
                if(err.response && err.response.data) {
                    if(err.response.data.errors[0].path === "name") {
                        setError(Translations.getId('page.auth.register.error.shortName'))
                    }
                    if(err.response.data.errors[0].path === "password") {
                        setError(Translations.getId('page.auth.register.error.password'))
                    }
                    if(err.response.data.errors[0].path === "email") {
                        setError(Translations.getId('page.auth.register.error.email'))
                    }
                } else {
                    setError(Translations.getId('page.auth.login.error.tooManyRequests'))
                }
            })
    }

    return (
        <div className="page-register">
            <h2><T id="page.auth.register.title"/></h2>

            {
                error && (
                    <div className="error">
                        {error}
                    </div>
                )
            }

            {
                codeVerify ? (<>
                    <div className="error">
                        <T id="page.auth.register.error.codeValidation"/>
                    </div>
                    <div className="text-right">
                        <Link to="/auth"><a className="btn"><T id="page.auth.register.backToLogin"/></a></Link>
                    </div>
                </>) : (<>
                    <label>
                        <div className="title"><T id="page.auth.register.input.name"/></div>
                        <input type="text"
                               onChange={(e) => setName(e.target.value)}
                               placeholder={Translations.getId('page.auth.register.input.name.placeholder')}/>
                    </label>
                    <label>
                        <div className="title"><T id="page.auth.register.input.email"/></div>
                        <input type="text"
                               onChange={(e) => setEmail(e.target.value)}
                               placeholder={Translations.getId('page.auth.register.input.email.placeholder')}/>
                    </label>
                    <label>
                        <div className="title"><T id="page.auth.register.input.password"/></div>
                        <input type="password"
                               onChange={(e) => setPasswd(e.target.value)}
                               placeholder={Translations.getId('page.auth.register.input.password.placeholder')}/>
                    </label>
                    <label>
                        <div className="title"><T id="page.auth.register.input.passwordAgain"/></div>
                        <input type="password"
                               onChange={(e) => setPasswdAgain(e.target.value)}
                               placeholder={Translations.getId('page.auth.register.input.passwordAgain.placeholder')}/>
                    </label>
                    <div className="text-right">
                        <span className="btn success" onClick={register}><T id="page.auth.register.register"/></span>
                    </div>
                </>)
            }
        </div>
    )
}

export default Register