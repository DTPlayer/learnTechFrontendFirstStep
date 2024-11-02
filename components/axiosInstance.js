import axios from 'axios';

// Создаем экземпляр Axios
export const axiosInstance = axios.create({
  baseURL: 'https://ltapi.mcnextcloud.ru',
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (process.client) {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        axiosInstance({
          method: "post",
          url: "/api/auth",
          data: {
            login: 'test',
            password: 'password',
          }
        }).then((response) => {
          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            config.headers.Authorization = `Bearer ${response.data.token}`;
          } else {
            console.log(response.data);
          }
        }).catch((error) => {
          console.log(error);
          localStorage.removeItem("token");
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);