import { Alert } from "@/types";
import { api } from "./api";

export const alertApi = {
  getAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await api.get(`/alert`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  createAlert: async (data: Partial<Alert>): Promise<Alert> => {
    try {
      const response = await api.post("/alert/", data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  deleteAlert: async (id: string): Promise<void> => {
    try {
      const response = await api.delete(`/alert/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  updateAlert: async (id: string, data: Partial<Alert>): Promise<Alert> => {
    try {
      const response = await api.put(`/alert/${id}`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
