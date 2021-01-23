import React, { useContext } from "react"
import PropTypes from "prop-types"
import { LanguageContext } from "../contexts/LanguageContextProvider"
import translation from "../lang/all"

const Text = (props) => {
    const langContext = useContext(LanguageContext)

    if (translation[langContext.lang][props.id]) {
        return <>{translation[langContext.lang][props.id]}</>
    } else {
        return <>{!langContext.showUnknownTranslation ? props.id : props.children}</>
    }
}

Text.propTypes = {
    children: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
}

export default Text
