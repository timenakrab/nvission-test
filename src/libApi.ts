// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const selfServerInstance = (headers): AxiosInstance =>
  axios.create({
    baseURL: `${publicRuntimeConfig.BASE_URL}`,
    timeout: 20000,
    headers: {
      ContentType: 'application/json',
      ...headers,
    },
  });

const fireServerGet = ({ url, headers, data }: AxiosRequestConfig): Promise<AxiosResponse> =>
  selfServerInstance(headers).post(url, { data });

// const fireServerGet = ({ url, headers }: AxiosRequestConfig): Promise<AxiosResponse> =>
//   axios.post(`${publicRuntimeConfig.base_url}/api/${url}`, { data });

export default fireServerGet;
