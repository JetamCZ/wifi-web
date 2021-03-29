import React, {createRef} from "react"
import { Link } from "react-router-dom"
import Steps from "./homepage/steps"
import config from "../config";
import Modal from "../components/Modal";

const HomePage = () => {
    const modalRef = createRef()

    return (
        <div className="page-homepage">
            <div className="topline">
                <div className="container">
                    <div className="logo">Locate.io {config.SCHOOL_PROMO &&  <span style={{color: "white"}}>Školní demo</span>}</div>
                    <div className="btns">
                        {
                            config.SCHOOL_PROMO ? (
                                <a href="https://wifi.puhony.eu/">
                                    <div className="btn success">Běžící webová aplikace</div>
                                </a>
                            ) : (
                                <Link to="/dashboard">
                                    <div className="btn success">Webová administrace</div>
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="welcome-slide">
                <div className="container">
                    <div className="box">
                        <p>Systém pro pasivní lokalizaci wifi zařízení v reálném čase!</p>

                        {
                            !config.SCHOOL_PROMO && (
                                <>
                                    <Link to="/dashboard">
                                        <div className="btn success">Webová administrace</div>
                                    </Link>
                                    <Link to="/docs">
                                        <div className="btn info">Manuál uživatele</div>
                                    </Link>
                                </>
                            )
                        }
                    </div>
                    <div className="map">
                        <div className="dot">
                            <img src="./img/pins/device-pin.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="container">
                    <div className="feature">
                        <img src="./img/icons/homepage/layers.svg" alt="" />
                        <h2>Zvládá vícero pater</h2>
                        <p>Neztratíte se ani v budově</p>
                    </div>
                    <div className="feature">
                        <img src="./img/icons/homepage/map-pin.svg" alt="" />
                        <h2>Vidíte kde jste</h2>
                        <p>Poloha zařízení se zobrazuje v reálném čase</p>
                    </div>
                    <div className="feature">
                        <img src="./img/icons/homepage/device-block.svg" alt="" />
                        <h2>Aplikaci nepotřebuješ</h2>
                        <p>Do zařízení nemusíš nic instalovat</p>
                    </div>
                    <div className="feature">
                        <img src="./img/icons/homepage/watch.svg" alt="" />
                        <h2>Docházka</h2>
                        <p>Systém můžeš využít i k záznamu docházky</p>
                    </div>
                </div>
            </div>

            <div className="video">
                <div className="container">
                    <h1>Co systém umí?..</h1>
                    <iframe src="https://www.youtube.com/embed/d26Hc7UGN2o" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen></iframe>
                    </div>
            </div>

            <div className="maturita">
                <div className="container cols-2">
                    <div className="left">
                        <p>
                            Tento projekt byl vytvořen jako maturitní projekt. Proto je plně otevřený k nahlédnutí kódu
                            a jeho dokumentace.
                        </p>

                        <div className="btn" onClick={() => modalRef.current.open()}>Dokumentace projektu a přílohy</div>
                    </div>
                    <div className="right">
                        <div className="sign">
                            <div className="title">Student vývojář</div>
                            <div className="name">Matěj Půhoný</div>
                        </div>

                        <div className="sign">
                            <div className="title">Konzultant</div>
                            <div className="name">RNDr. Jan Koupil, Ph.D.</div>
                        </div>

                        <div className="sign">
                            <div className="title">Škola</div>
                            <div className="name">DELTA - Střední škola informatiky a ekonomie, s.r.o.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <Steps />
            </div>

            <Modal ref={modalRef}>
                <h1 style={{fontSize: "3.5em", marginBottom: "60px"}}>Dokumenty ke stažení</h1>

                <h2>Dokumentace</h2>
                <a href="https://b2017puhoma.delta-www.cz/maturita/dokumentace/puhony_SOC_28_3_2021.pdf" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Dokumentace .pdf</div>
                </a>
                <a href="https://b2017puhoma.delta-www.cz/maturita/dokumentace/puhony_SOC_28_3_2021.docx" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Dokumentace .docx</div>
                </a>

                <br/><br/>

                <h2>Git repositáře</h2>
                <a href="https://github.com/JetamCZ/wifi-web" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Git repositář - web</div>
                </a>
                <a href="https://github.com/JetamCZ/wifi-api" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Git repositář - api</div>
                </a>
                <a href="https://github.com/JetamCZ/wifi-slave" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Git repositář - majáky</div>
                </a>

                <br/><br/>
                <h2>Videa</h2>
                <a href="https://b2017puhoma.delta-www.cz/maturita/dokumentace/fingerprinty-demo-venku.mp4" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Demo fingerprinty venku</div>
                </a>

                <a href="https://b2017puhoma.delta-www.cz/maturita/dokumentace/trilaterace-demo.mp4" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Demo trilaterace venku</div>
                </a>

                <a href="https://b2017puhoma.delta-www.cz/maturita/dokumentace/fingerprinty_demo_vevnitr.mp4" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Demo fingerprinty uvnitř</div>
                </a>

                <br/><br/>
                <h2>Snímky z aplikace</h2>
                <a href="./dokumentace/screens/dashboard.png" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Dashboard</div>
                </a>
                <a href="./dokumentace/screens/map2.png" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Zobrazení lokalizace</div>
                </a>
                <a href="./dokumentace/screens/status.png" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Status majáků</div>
                </a>
                <a href="./dokumentace/screens/organizace.png" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Stránka organizace</div>
                </a>

                <br/><br/>
                <h2>Ostatní</h2>
                <a href="./dokumentace/zadani-maturitni-prace.jpg" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Zadání maturitní práce</div>
                </a>
                <a href="./dokumentace/design.png" target="_blank" rel="noopener noreferrer">
                    <div className="btn">Design náhled</div>
                </a>
            </Modal>

            <div className="footer">
                <div className="container">
                    Locate.io | 2020 - {new Date().getFullYear()} | Maturitní projekt{" "}
                    <a href="https://puhony.eu/" target="_blank" rel="noopener noreferrer nofollow">
                        Matěj Půhoný
                    </a>{" "}
                    |{" "}
                    {process.env.VERCEL_GIT_COMMIT_SHA
                        ? process.env.VERCEL_GIT_COMMIT_SHA + " (" + process.env.VERCEL_GIT_COMMIT_MESSAGE + ")"
                        : "development"}
                </div>
            </div>
        </div>
    )
}

export default HomePage
