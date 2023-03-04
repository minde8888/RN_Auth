import axios, { AxiosRequestHeaders } from "axios";
import { authHeader } from "./authHeader";
import { store } from "../../redux/store";
import {
  AuthState,
  changeRefreshToken,
  userLogout,
} from "../../redux/slice/authSlice";
import createAuthRefreshInterceptor from "axios-auth-refresh";

interface Response {
  token: string;
  refreshToken: string;
  susses:boolean;
}

const api = axios.create({    
  baseURL: "https://localhost:9002/api/v1/",
});

interface AxiosRequestConfig<T = any> {
  headers: AxiosRequestHeaders;
}

api.interceptors.request.use(
  (config: AxiosRequestConfig<any>): AxiosRequestConfig<any> => {
    if (!config) throw new Error(`Expected 'config' not to be undefined`);
    const newHeader = {
      ...(config.headers || {}),
      ...authHeader(),
    } as AxiosRequestHeaders;
    config.headers = newHeader;
    return config;
  },
  (error) => {
    throw new Error("Header error" + error);
  }
);

const refreshAuthLogic = async (failedRequest: any): Promise<void> => {
  try {
    const auth: AuthState = store.getState().data.auth;

    const response = await api.post<Response>("auth/RefreshToken/", {
      token: auth.token,
      refreshToken: auth.refreshToken,
    });

    const { token, refreshToken } = response.data;
    if (!(token.length !== 0 || refreshToken.length !== 0))
      throw Error("no token found");
    store.dispatch(changeRefreshToken({ token, refreshToken }));
  } catch (error) {
    store.dispatch(userLogout());
    throw error;
  }
};

createAuthRefreshInterceptor(api, refreshAuthLogic);

export default api;
