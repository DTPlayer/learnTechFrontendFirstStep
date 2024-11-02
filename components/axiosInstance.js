import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://ltapi.mcnextcloud.ru',
});