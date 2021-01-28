import React from "react";
import {Link} from "react-router-dom";
import Steps from "./homepage/steps";

const HomePage = () => {
    return (
        <div className="page-homepage">
            <div className="topline">
                <div className="container">
                    <div className="logo">
                        Locate.io
                    </div>
                    <div className="btns">
                        <Link to="/dashboard">
                            <div className="btn success">Webová administrace</div>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="welcome-slide">
                <div className="container">
                    <div className="box">
                        <p>Systém pro pasivní lokalizaci wifi zařízení v reálném čase!</p>

                        <Link to="/dashboard">
                            <div className="btn success">Webová administrace</div>
                        </Link>
                        <Link to="/docs">
                            <div className="btn info">Manuál uživatele</div>
                        </Link>
                    </div>
                    <div className="map">
                        <div className="dot">
                            <img src="/img/pins/device-pin.png" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="features">
                <div className="container">
                    <div className="feature">
                        <img src="/img/icons/homepage/layers.svg" alt=""/>
                        <h2>Zvládá vícero pater</h2>
                        <p>Neztratíte se ani v budově</p>
                    </div>
                    <div className="feature">
                        <img src="/img/icons/homepage/device-block.svg" alt=""/>
                        <h2>Aplikaci nepotřebuješ</h2>
                        <p>Do zařízení nemusíš nic instalovat</p>
                    </div>
                    <div className="feature">
                        <img src="/img/icons/homepage/watch.svg" alt=""/>
                        <h2>Docházka</h2>
                        <p>Systém můžeš využít i k záznamu docházky</p>
                    </div>
                </div>
            </div>

            <div className="maturita">
                <div className="container cols-2">
                    <div className="left">
                        <p>Tento projekt byl vytvořen jako maturitní projekt. Proto je plně otevřený k nahlédnutí kódu a
                            jeho dokumentace.</p>

                        <div className="btn">Dokumentace .pdf</div>
                        <div className="btn">Dokumentace .docx</div>
                        <br/>
                        <a href="https://github.com/JetamCZ/wifi-web" target="_blank" rel="noopener noreferrer"><div className="btn">Git repositář - web</div></a>
                        <a href="https://github.com/JetamCZ/wifi-wifi" target="_blank" rel="noopener noreferrer"><div className="btn">Git repositář - api</div></a>
                        <a href="https://github.com/JetamCZ/wifi-slave" target="_blank" rel="noopener noreferrer"><div className="btn">Git repositář - majáky</div></a>
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
                <Steps/>
            </div>


            <div className="footer">
                <div className="container">
                    Locate.io | 2020 - {new Date().getFullYear()} | Maturitní projekt {" "}
                    <a href="https://puhony.eu/" target="_blank" rel="noopener noreferrer nofollow">Matěj Půhoný</a>
                </div>
            </div>
        </div>
    )
}

export default HomePage