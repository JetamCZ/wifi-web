import React from "react";
import {Link} from "react-router-dom";

const Locs = (props) => {
    return (
        <div>
            <h1>Lokalizace</h1>
            <div className="com-locsWrapper">
                {
                    props.localizations.map(loc =>
                        <div className="loc">
                            <div className="name">{loc.name}</div>
                            <div>{loc.deviceCount} aktivní zařízení</div>

                            <Link to={"/localizations/"+loc._id}>Zobrazit</Link>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Locs