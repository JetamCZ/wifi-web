import React, {useState} from "react";
import Text from "../components/Text";
import StatusBar from "../components/StatusBar";
import {NavLink} from "react-router-dom"

const MainLayout = (props) => {
    const [full, setFull] = useState(false)

    const toggle = (value) => {
        if(window.innerWidth > 700) {
            setFull(value)
        }
    }

    return (
        <div className={full ? "layout-frame" : "layout-frame compact"}>
            <div className="main-menu"
                 onMouseEnter={() => toggle(true)}
                 onMouseLeave={() => toggle(false)}
            >
                <div className="logo">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
                    </svg>
                    <span className='web-title'><Text id='title'>Locate.io</Text></span>
                </div>

                <nav className="main-nav">
                    <NavLink to="/dashboard" activeClassName="active">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                        <span className='nav-text'><Text id={'menu.dashboard'}>Dashboard</Text></span>
                    </NavLink>
                    <NavLink to="/devices" activeClassName="active">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className='nav-text'><Text id={'menu.devices'}>Zařízení</Text></span>
                    </NavLink>
                    <NavLink to="/beacons" activeClassName="active">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>
                        <span className='nav-text'><Text id={'menu.beacons'}>Majáky</Text></span>
                    </NavLink>
                    <NavLink to="/maps" activeClassName="active">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className='nav-text'><Text id={'menu.maps'}>Maps</Text></span>
                    </NavLink>
                    <NavLink to="/settings" activeClassName="active">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className='nav-text'><Text id={'menu.settings'}>Nastavení</Text></span>
                    </NavLink>
                </nav>

            </div>
            <div className="board">
                <StatusBar/>
                <div className="main-content">
                    <div className="top-line">
                        <h1>{props.title}</h1>
                    </div>

                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default MainLayout;