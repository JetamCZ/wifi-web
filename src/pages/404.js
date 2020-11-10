import React from "react";
import Text from "../components/Text";
import {Link} from "react-router-dom"

const Error404 = () => {
    return (
        <>
            <div className="page-404">
                <div className="box">
                    <img src='/img/people/096.png' className="u--pulse animation-infinite" alt="error illustration"/>
                    <h1><Text id={"page-error404.title"}>Chyba 404</Text></h1>
                    <p>
                        <Text id={"page-error404.info"}>Vámi hledaná stránka neexistuje. Prosím zkontrolujte zadanou URL adresu.</Text>
                    </p>
                    <div className="link">
                        <Link to="/" className='btn btn-light'><Text id={"page-error404.back-to-dashboard"}>Zpět na dashboard</Text></Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error404;