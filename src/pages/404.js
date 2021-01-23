import React from "react"
import { Link } from "react-router-dom"
import T from "../components/T"

const Error404 = () => {
    return (
        <>
            <div className="page-404">
                <div className="box">
                    <img src="/img/empty/search.svg" className="u--pulse animation-infinite" alt="error illustration" />
                    <h1>
                        <T id="page.page404.errorTitle" />
                    </h1>
                    <p>
                        <T id="page.page404.errorDesc" />{" "}
                    </p>
                    <div className="link">
                        <Link to="/" className="btn btn-light">
                            <T id="page.page404.errorBackBtn" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error404
