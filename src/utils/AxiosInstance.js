import Axios from "axios";

const AxiosInstance = Axios.create({
    baseURL: 'https://wifilocation.herokuapp.com/',
    baseLocalURL: 'http://192.168.1.126:8000/',
    timeout: 20*1000,
})

export default AxiosInstance