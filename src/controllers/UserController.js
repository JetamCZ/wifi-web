import AxiosInstance from "../utils/AxiosInstance";
import jwt_decode from "jwt-decode";

class UserController {
  login(token) {
    window.localStorage.setItem("AUTH_TOKEN", token);
    window.localStorage.setItem("AUTH_USER", JSON.stringify(jwt_decode(token)));
    AxiosInstance.defaults.headers.common["Authorization"] =
      "Bearer " + window.localStorage.getItem("AUTH_TOKEN");
  }

  logout() {
    window.localStorage.removeItem("AUTH_TOKEN");
    window.localStorage.removeItem("AUTH_USER");
    AxiosInstance.defaults.headers.common["Authorization"] = "";
  }

  getToken() {
    return window.localStorage.getItem("AUTH_TOKEN") || "";
  }
}

export default new UserController();
