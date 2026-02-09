import axios from 'axios';
import { environment } from 'src/environments/environment';

export const httpServer = axios.create({
  baseURL: environment.API_URL + "/",
  headers: {
    'Content-type': 'application/json',

  },
  withCredentials: true
});

export const storageHttpServer = axios.create({
  baseURL: environment.API_URL + "/",
  headers: {
    'Content-Type': 'multipart/form-data',

  },
  withCredentials: true
});

storageHttpServer.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    // Check if URL includes 'crm' and token exists
    if (config.url && config.url.includes('crm') && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpServer.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // Check if URL includes 'crm' and token exists
    if (config.url && config.url.includes('crm') && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import { ErrorResponse } from 'src/models/response/TResponses';

axios.interceptors.response.use(
  response => response,
  error => {
    const response = error.response;

    // Network / CORS / timeout
    if (!response) {
      throw new ErrorResponse(
        {
          message: 'Network error',
          errors: null,
          status: 0,
        },
        error
      );
    }

    const data = response.data;

    // Django-standard error
    throw new ErrorResponse(
      {
        message: data.message ?? 'Unexpected error',
        errors: data.errors ?? null,
        status: response.status,
      },
      error
    );
  }
);

