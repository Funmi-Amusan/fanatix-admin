import { getAuthTokens } from "@/lib/storage";
import { httpClient } from "../httpClient";
import type { AdminsResponse, FetchAdminsParams, addAdminRequest, addAdminResponse } from "../types/admins";

export const adminEndpoints = {
  fetchAdmins: async (params: FetchAdminsParams = {}): Promise<AdminsResponse> => {
    const { token } = getAuthTokens();
    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();      
    return httpClient.get<AdminsResponse>(`/admin?${queryString}`, token);
  },
  addAdmin: async (credentials: addAdminRequest): Promise<addAdminResponse> => {
    return httpClient.post<addAdminResponse>('/admin/add', credentials);
  },
  deleteAdmin: async (adminId: string): Promise<addAdminResponse> => {
    return httpClient.delete<addAdminResponse>(`/admin/add${adminId}`, );
  },
};