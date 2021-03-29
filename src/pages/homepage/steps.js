import React, { useState } from "react"
import Slider from "./Slider"

const Steps = () => {
    const [step, setStep] = useState(1)

    return (
        <div className="setup">
            <div className="steps">
                <div className={step === 1 ? "step active" : "step"} onClick={() => setStep(1)}>
                    <div className="num">1</div>
                    <div className="text">Vytvoření organizace</div>
                </div>
                <div className={step === 2 ? "step active" : "step"} onClick={() => setStep(2)}>
                    <div className="num">2</div>
                    <div className="text">Instalace majáků</div>
                </div>
                <div className={step === 3 ? "step active" : "step"} onClick={() => setStep(3)}>
                    <div className="num">3</div>
                    <div className="text">Nastavení lokalizace</div>
                </div>
            </div>
            <div className="content">
                {step === 1 && (
                    <div className="step">
                        <div className="text">
                            <h1>Vytvoření organizace</h1>
                            <p>
                                Veškeré plány budov a lokalizace ukládáte ke své organizaci a tak omezíte přístupu dat
                                osobám, které by je mít neměli.
                            </p>
                            <p>
                                K založení organizace je zapotřebí speciální registrační klíč, který lze získat po
                                kontaktování emailu <b>info@puhony.eu</b>.
                            </p>
                        </div>
                        <div className="images mw">
                            <img src="./img/homepage/beacon.jpg" alt="" />
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="step">
                        <div className="text">
                            <h1>Instalace majáků</h1>
                            <p>
                                Majáky je potřeba vhodně rozmístit. Přesnost lokalizace se dá zlepšít přidáním vícero
                                majáků.
                            </p>
                            <p>Ke své organizaci v administraci jej vložíte díky jejich speciálnímu kódu.</p>
                        </div>

                        <div className="images mw">
                            <Slider
                                slides={[
                                    {
                                        img: "./img/homepage/map1.svg",
                                        desc: "Takto instalované majáky jsou příliš blízko u sebe!"
                                    },
                                    {
                                        img: "./img/homepage/map2.svg",
                                        desc: "Minimální počet majáků by měl být 3!"
                                    },
                                    {
                                        img: "./img/homepage/map3.svg",
                                        desc: "Ideální instalace majáků"
                                    }
                                ]}
                            />
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="step">
                        <div className="text">
                            <h1>Nastavení organizace a lokalizace</h1>
                            <p>V administraci si nahrajete plán budovy a následně jej můžete využít v lokalizacích.</p>
                            <p>Některé typy lokalizací vyžadují kalibraci, neboli nasmínání fingerprintů.</p>
                        </div>
                        <div className="images mw">
                            <img src="./img/homepage/print.jpg" alt="" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Steps
