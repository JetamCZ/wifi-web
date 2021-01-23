import Axios from "axios"
import config from "../config"

const AxiosInstance = Axios.create({
    baseURL: config.apiBaseURL,
    timeout: 20 * 1000,
    transformResponse: [
        (data) => {
            try {
                data = JSON.parse(data)

                if (data && data.error && (data.error === "TOKEN_REQUIRED" || data.error === "TOKEN_VALIDATION")) {
                    //window.localStorage.removeItem('AUTH_TOKEN')
                    window.location.replace("/auth")
                }
            } catch (e) {}
            return data
        }
    ]
})

if (window.localStorage.getItem("AUTH_TOKEN")) {
    AxiosInstance.defaults.headers.common["Authorization"] = "Bearer " + window.localStorage.getItem("AUTH_TOKEN")
}

export default AxiosInstance
