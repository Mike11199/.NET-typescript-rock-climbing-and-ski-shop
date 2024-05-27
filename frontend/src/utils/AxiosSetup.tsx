import axios from "axios";

const setupAxiosInterceptor = () => {
  axios.interceptors.request.use(
    async (config) => {
      if (!config.headers) {
        config.headers = {};
      }

      const getToken = async () => {
        let token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        return token;
      };

      const token = await getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );
};

export default setupAxiosInterceptor;
