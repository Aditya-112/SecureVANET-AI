import axios from 'axios';

const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiBaseUrl = (): string => {
  const stored = localStorage.getItem('securevanet_api_url');
  if (stored && !stored.includes('onrender.com') && !stored.includes('render.com')) {
    return stored;
  }
  return DEFAULT_API_URL;
};

export const getWebSocketUrl = (): string => {
  const customWs = localStorage.getItem('securevanet_ws_url');
  if (customWs && !customWs.includes('onrender.com') && !customWs.includes('render.com')) {
    return customWs;
  }

  const baseUrl = getApiBaseUrl();

  if (baseUrl.startsWith('https://')) {
    return baseUrl.replace('https://', 'wss://') + '/ws/live';
  }

  return baseUrl.replace('http://', 'ws://') + '/ws/live';
};

export const api = axios.create({
  headers: {
    Accept: 'application/json',
  },
  timeout: 300000,
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});