"use client";
import { useDeleteAlert, useGetAlerts, useUpdateAlert } from "@/hooks/alerts";
import { useState } from "react";
import { toast } from "sonner";
import AlertCommand from "./alert-command";
import { Icon } from "./ui";

const AlertList = () => {
  const { data: alerts, isLoading } = useGetAlerts();
  const deleteAlert = useDeleteAlert();
  const updateAlert = useUpdateAlert();
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);

  const handleDelete = async (alertId: string) => {
    try {
      await deleteAlert.mutateAsync(alertId);
      toast.success("Alert deleted successfully");
    } catch (error) {
      toast.error("Failed to delete alert");
    }
  };

  const parseStockSymbol = (stockIdentifier: string) => {
    // Extract symbol from "Apple Inc. (AAPL)" format
    const match = stockIdentifier.match(/\(([^)]+)\)/);
    return match ? match[1] : stockIdentifier;
  };

  const parseCompanyName = (stockIdentifier: string) => {
    // Extract company name from "Apple Inc. (AAPL)" format
    const match = stockIdentifier.match(/^([^(]+)/);
    return match ? match[1].trim() : stockIdentifier;
  };

  const getConditionSymbol = (condition: string) => {
    return condition === "greater_than" ? ">" : "<";
  };

  const formatFrequency = (frequency: string) => {
    const frequencyMap: Record<string, string> = {
      once_per_minute: "Once per minute",
      once_per_hour: "Once per hour",
      once_per_day: "Once per day",
    };
    return frequencyMap[frequency] || frequency;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Alerts</h2>
          <AlertCommand />
        </div>
        <div className="flex items-center justify-center h-40">
          <p className="text-gray-400">Loading alerts...</p>
        </div>
      </div>
    );
  }

  console.log("Alerts data:", alerts);

  return (
    <div className="flex flex-col gap-4 px-4 md:px-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Alerts</h2>
        <AlertCommand />
      </div>

      {!alerts || alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-800/50 rounded-lg border border-gray-700">
          <Icon name="Bell" className="size-12 text-gray-600 mb-3" />
          <p className="text-gray-400 text-lg mb-4">No alerts set up yet</p>
          <p className="text-gray-500 text-sm mb-4">
            Create price or volume alerts to stay informed
          </p>
          <AlertCommand />
        </div>
      ) : (
        <div className="space-y-4 max-h-[800px] bg-gray-800 overflow-y-auto p-4 rounded-lg">
          {alerts.map((alert) => {
            const symbol = parseStockSymbol(alert.stockIdentifier);
            const companyName = parseCompanyName(alert.stockIdentifier);
            const isPositive = alert.condition === "greater_than";

            return (
              <div
                key={alert._id}
                className="bg-gray-700 rounded-lg p-3 border transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  {/* Stock Info */}
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                      <Icon
                        name="TrendingUp"
                        className="size-6 text-yellow-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{companyName}</h3>
                      <p className="text-sm text-gray-400">
                        ${alert.threshold.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono text-gray-300">
                        {symbol}
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isPositive ? "+1.4%" : "-2.53%"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-px w-full border my-4 border-gray-600" />
                {/* Alert Details */}
                <div className="flex flex-col ">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Alert:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingAlertId(alert._id!)}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                        title="Edit alert"
                        aria-label="Edit alert"
                      >
                        <Icon name="Pencil" className="size-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(alert._id!)}
                        disabled={deleteAlert.isPending}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                        title="Delete alert"
                        aria-label="Delete alert"
                      >
                        <Icon name="Trash2" className="size-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white font-mono text-sm">
                      {alert.type === "price" ? "Price" : "Volume"}{" "}
                      {getConditionSymbol(alert.condition)} $
                      {alert.threshold.toFixed(2)}
                    </span>
                    {/* Frequency Badge */}

                    <span className="inline-block mt-1 px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-md border border-yellow-500/30">
                      {formatFrequency(alert.frequency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AlertList;
