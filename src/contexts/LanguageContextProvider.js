import React, { useState } from "react"

export const LanguageContext = React.createContext()

const LanguageContextProvider = (props) => {
    const [state, setState] = useState(
        window.localStorage.getItem("LanguageContext")
            ? JSON.parse(window.localStorage.getItem("LanguageContext"))
            : {
                  lang: "en",
                  showUnknownTranslation: true
              }
    )

    const setLanguage = (lang, showUnknownTranslation) => {
        setState({ lang, showUnknownTranslation })
        window.localStorage.setItem("LanguageContext", JSON.stringify({ lang, showUnknownTranslation }))
    }

    return <LanguageContext.Provider value={{ ...state, setLanguage }}>{props.children}</LanguageContext.Provider>
}

export default LanguageContextProvider
