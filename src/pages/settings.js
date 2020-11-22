import React, {useContext, useState} from "react";
import {LanguageContext} from "../contexts/LanguageContextProvider";
import Text from "../components/Text";
import {StatusBarContext} from "../contexts/StatusBarProvider";

const Settings = () => {
    const LangContext = useContext(LanguageContext);
    const StatusContext = useContext(StatusBarContext)

    const [formValues, setFormValues] = useState({
        lang: LangContext.lang,
        showDefault: LangContext.showUnknownTranslation
    })

    const modifyValue = (field, value) => {
        const newValues = {...formValues};
        newValues[field] = value;
        setFormValues(newValues)
    }

    const save = () => {
        LangContext.setLanguage(formValues.lang, JSON.parse(formValues.showDefault))

        StatusContext.setStatus({
            hide: 3,
            text: <Text id='page-settings'>Settings saved</Text>,
            type: 'success'
        })
    }

    return (
        <div className="page-settings w-page-800">
            <h2 className=""><Text id="page-settings.language">Language</Text></h2>
            <div className="form-2-cols">
                <label className="input-frame">
                    <div className="title"><Text id={'page-settings.language.lang'}>Language</Text></div>
                    <select defaultValue={LangContext.lang}
                        onChange={(e) => modifyValue('lang', e.target.value)}
                    >
                        <option value={'cs'}>CS</option>
                        <option value={'en'}>EN</option>
                    </select>
                </label>
                <label className="input-frame">
                    <div className="title"><Text id={'page-settings.language.unknown-translations'}>Unknown translations</Text></div>
                    <select defaultValue={LangContext.showUnknownTranslation}
                            onChange={(e) => modifyValue('showDefault', e.target.value)}
                    >
                        <option value={false}>
                            ID
                        </option>
                        <option value={true}>
                            Default text
                        </option>
                    </select>
                </label>
            </div>

            <h2 className=""><Text id="page-settings.api">API</Text></h2>
            <p>toto nastavení v tuto chvíli není možné změnit</p>

            {/*
            <label className="input-frame">
                    <div className="title"><Text id={'page-settings.title'}>Title</Text></div>
                    <input type="text" placeholder="abcd"/>
                    <div className="hint">Some secreat hint</div>
                </label>

            */}

            <div className="text-right">
                <span className="btn btn-primary" onClick={save}>Uložit</span>
            </div>
        </div>
    )
}

export default Settings