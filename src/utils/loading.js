import React from "react";
import Text from "../components/Text";
import PropTypes from 'prop-types';

const Loading = (props) => {
    return (
        <div className={"loading shadow" + (props.isError && " isError")}>
            <div className="center">
                {
                    props.isError ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                                 className="animate__animated animate__pulse animate__infinite"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <div className="loading-title"><Text id={'loading.error'}>Nastala chyba!</Text></div>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                                 className="animate__animated animate__pulse animate__infinite"
                            >
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            <div className="loading-title"><Text id={'loading'}>Načítání</Text>...</div>
                        </>
                    )
                }
            </div>
        </div>
    )
}

Loading.propTypes = {
    isError: PropTypes.bool
}

export default Loading