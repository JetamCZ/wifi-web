import React from "react"

const Docs = () => {
    return (
        <div className="page-docs">
            <div className="container-white">
                <h1 className="logo">Locate.io</h1>

                <section>
                    <h2>Úprava místností</h2>

                    <div className="cols-2">
                        <div className="smaller">
                            <img src="/img/tutorial/selectVector2.gif" alt="Select area gif" />
                        </div>
                        <div className="bigger">
                            <h3>Úprava a přidávání bodů</h3>
                            <p>
                                Místnost není vždy jen obdelník! to není žádné zvlášní zjištění. A proto je možné při
                                úpravě místnosti přidat vícero bodů, pro manipulaci polygonu.
                            </p>
                            <p>
                                Přidat bod můžeš tím že <b>klikneš na menší kolečko</b>, které je mezi dvěmi již
                                existujícími body.
                            </p>
                        </div>
                    </div>

                    <div className="cols-2">
                        <div className="bigger">
                            <h3>Mazání bodů</h3>
                            <p>
                                Přidal jsi více bodů než je zdrávo? Bod odebereš kliknutím na samotný bod. Je potřeba
                                mít nejméně 3 body!
                            </p>
                        </div>
                        <div className="smaller">
                            <img src="/img/tutorial/selectVectorDelete.gif" alt="Select area gif" />
                        </div>
                    </div>
                </section>

                <section>
                    <h2>Metody lokalizace</h2>

                    <h3>Co je to fingerprint?</h3>
                    <p>
                        Fingerprint je uložený záznam o poloze zařízení vůči získaným úbytkům sil signálu. Využívají se
                        při lokalizaci, kdy získaná data se porovnávají již s dříve uloženými fingerprinty.
                    </p>
                </section>
                <section>
                    <div className="cols-2">
                        <div className="smaller">
                            <img src="/img/tutorial/fingerprints.png" alt="Select area gif" />
                        </div>
                        <div className="bigger">
                            <h3>Nejbližší fingerprint</h3>
                            <p>Tato lokalizace funguje na bázi fingerprintů (viz. Co je to fingerprint)</p>
                            <p>
                                Donec vitae arcu. Proin pede metus, vulputate nec, fermentum fringilla, vehicula vitae,
                                justo. Et harum quidem rerum facilis est et expedita distinctio.
                            </p>
                        </div>
                    </div>
                    <div className="cols-2">
                        <div className="bigger">
                            <h3>Where is Waldo?!</h3>
                            <p>
                                Tuto lokalizaci je easter egg (překvápko k nalezení) ve webové aplikaci. Nejspíš jej ale
                                nikdy nenajdeš.
                            </p>
                        </div>
                        <div className="smaller">
                            <img src="/img/tutorial/where-is-wally-banner.jpg" alt="Select area gif" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Docs
