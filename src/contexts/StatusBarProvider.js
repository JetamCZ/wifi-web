import React, {useState} from "react";

export const StatusBarContext = React.createContext()

const StatusBarProvider = (props) => {
    const [state, setState] = useState({
        text: 'w',
        type: '',
        hide: -1
    })

    const setStatus = (status) => {
        setState(status)

        if (status.hide !== 0 || status.hide !== -1) {
            setTimeout(() => {
                const newVal = {...status}
                newVal.hide = -1;
                setStatus(newVal)
            }, status.hide * 1000)
        }
    }

    return (
        <StatusBarContext.Provider value={{...state, setStatus}}>
            {props.children}
        </StatusBarContext.Provider>
    )
}

export default StatusBarProvider;