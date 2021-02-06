import React from "react"
import T from "../components/T"
import Jdenticon from "react-jdenticon"
import faker from "faker/locale/cz"
import Translations from "../utils/Translations"
import formats from "../utils/formats"
import Map from "./maps/plans/Map"

const CssPlayground = () => {
    return (
        <div className="page-CssPlayground container">
            <h1>Css playground!</h1>

            <h2>Nadpisy</h2>
            <div>
                <h1>Title h1</h1>
                <h2>Title h2</h2>
                <h3>Title h3</h3>
                <h4>Title h4</h4>
                <h5>Title h5</h5>
                <h6>Title h6</h6>
            </div>

            <div className="gap h-5"></div>

            <h2>Tlačítka</h2>
            <div>
                <h3>Classic size</h3>
                <div className="btn">Info</div>
                <div className="btn success">Success!</div>
                <div className="btn warning">warning</div>
                <div className="btn danger">danger</div>

                <h3>Small</h3>
                <div className="btn sm">Info</div>
                <div className="btn sm success">Success!</div>
                <div className="btn sm warning">warning</div>
                <div className="btn sm danger">danger</div>
            </div>

            <div className="gap h-5"></div>

            <h2>Text align</h2>
            <div>
                <div className="text-left">Left</div>
                <div className="text-center">Center</div>
                <div className="text-right">Right</div>
            </div>

            <div className="gap h-5"></div>

            <h2>Inputs</h2>
            <div className="cols cols-3">
                <label className="form-control">
                    <div className="title">Jméno</div>
                    <input type="text" placeholder="Zadej jméno" />
                </label>

                <label className="form-control">
                    <div className="title">Heslo</div>
                    <input type="password" placeholder="Zadej Heslo" />
                </label>

                <label className="form-control">
                    <div className="title">číslo</div>
                    <input type="number" placeholder="Zadej číslo" />
                </label>

                <label className="form-control">
                    <div className="title">select</div>
                    <select name="" id="">
                        <option value="">A</option>
                        <option value="">B</option>
                        <option value="">C</option>
                    </select>
                </label>
            </div>

            <div>
                <label className="form-control">
                    <div className="title">Text area</div>
                    <textarea placeholder="Napiš mi tady text" />
                </label>
            </div>

            <div className="gap h-5"></div>

            <h2>Tabulky</h2>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Jméno</th>
                            <th>
                                Poslední aktivita <span className="desc">(popisek)</span>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(3)].map((user, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>
                                    <div className="avatar">
                                        <Jdenticon size="30px" value={faker.internet.email()} />
                                    </div>
                                    <div className="two-line">
                                        <div className="line">{faker.name.findName()}</div>
                                        <div className="line light">{faker.internet.email()}</div>
                                    </div>
                                </td>
                                <td>před 2 hodinama</td>
                                <td className="text-right">
                                    <div className="btn sm">zobrazit člena</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan="4" className="text-right">
                                <div className="btn sm">1</div>
                                <div className="btn sm success">2</div>
                                <div className="btn sm">3</div>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="gap h-5"></div>

            <h2>Mapa</h2>
            <Map
                layers={[
                    {
                        name: "zahrada",
                        image: "/img/maps/3.png"
                    },
                    {
                        name: "přízemí",
                        image: "/img/maps/5.png"
                    },
                    {
                        name: "první patro",
                        image: "/img/maps/4.png"
                    }
                ]}
            />

            <div className="gap h-5"></div>

            <h2>Summary</h2>
            <div className="summary">
                <div className="item">
                    <div className="title">Email:</div>
                    <div className="value">m@m.cz</div>
                </div>
                <div className="item">
                    <div className="title">Počet zařízení:</div>
                    <div className="value">29</div>
                </div>
                <div className="item">
                    <div className="title">Poslední aktivita:</div>
                    <div className="value">5h</div>
                </div>
            </div>

            <div className="gap h-10"></div>
        </div>
    )
}

export default CssPlayground
