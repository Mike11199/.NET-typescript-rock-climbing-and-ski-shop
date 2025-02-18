import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/userActions";

const setupAxiosInterceptor = () => {
  const dispatch = useDispatch();

  axios.interceptors.request.use(
    async (config) => {
      if (!config.headers) {
        config.headers = {};
      }

      const getToken = async () => {
        let token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
          return null;
        }

        try {
          const payloadBase64 = token.split(".")[1];

          if (!payloadBase64) {
            console.error("Invalid token format");
            return null;
          }
          const decodedPayload = JSON.parse(atob(payloadBase64));

          if (!decodedPayload.exp || decodedPayload.exp * 1000 < Date.now()) {
            console.log("Token is expired");
            dispatch(logout());
            return null;
          }

          return token;
        } catch (error) {
          return null;
        }
      };

      const token = await getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default setupAxiosInterceptor;
