import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { getApiClient } from './axiosInstance';

export const axiosBaseQuery =
  () // { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  : BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      skipAuth?: boolean;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, skipAuth }) => {
    try {
      const apiClient = getApiClient();
      const result = await apiClient.request({
        url,
        method,
        data,
        params,
        skipAuth,
      });

      return { data: result };
    } catch (error) {
      const axiosError = error as AxiosError;
      return {
        error: {
          status: axiosError.response?.status || 500,
          data: axiosError.response?.data || axiosError.message,
        },
      };
    }
  };
