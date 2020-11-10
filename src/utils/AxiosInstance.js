import Axios from "axios";

const AxiosInstance = Axios.create({
    baseURL: 'https://wifilocation.herokuapp.com/',
    timeout: 20*1000,
})

export default AxiosInstance