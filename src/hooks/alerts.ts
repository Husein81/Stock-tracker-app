import { alertApi } from "@/lib/hooks/alertApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetAlerts = () =>
  useQuery({
    queryKey: ["alerts"],
    queryFn: alertApi.getAlerts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

export const useCreateAlerts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["alerts"],
    mutationFn: alertApi.createAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["alerts"],
    mutationFn: alertApi.deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["alerts"],
    mutationFn: ({ id, data }: { id: string; data: Partial<any> }) =>
      alertApi.updateAlert(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};
