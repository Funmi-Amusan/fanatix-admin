import { httpClient } from "../httpClient";
import type { LoginRequest, LoginResponse, ChangePasswordRequest, ChangePasswordResponse } from "../types/auth";

export const authEndpoints = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    return httpClient.post<LoginResponse>('/admin/authentication/login', credentials);
  },
  changePassword: async (credentials: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    return httpClient.post<ChangePasswordResponse>('/admin/authentication/password/change', credentials);
  },
};