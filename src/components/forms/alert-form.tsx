import { useForm } from "@tanstack/react-form";
import { Alert, Watchlist } from "@/types";
import InputField from "./input-field";
import SelectField from "./select-field";
import { Button, Label } from "../ui";
import PulseLoader from "../pulse-loader";
import { useStockStore } from "@/store/useStock";
import { useCreateAlerts } from "@/hooks/alerts";

enum AlertType {
  PRICE = "price",
  VOLUME = "volume",
}

const alertOptions = [
  { value: AlertType.PRICE, label: "Price" },
  { value: AlertType.VOLUME, label: "Volume" },
];

type Props = {
  alert?: Alert;
  watchlist?: Watchlist;
};

const AlertForm = ({ alert, watchlist }: Props) => {
  const { stocks, setStocks, fetchStocks } = useStockStore();

  const createAlerts = useCreateAlerts();
  const stockIdentifier = watchlist?.company + " (" + watchlist?.symbol + ")";
  const form = useForm({
    defaultValues: {
      name: alert?.name || "",
      stockIdentifier: stockIdentifier || "",
      type: alert?.type || "price",
      condition: alert?.condition || "greater_than",
      threshold: alert?.threshold || 0,
      frequency: alert?.frequency || "once_per_minute",
    },
    onSubmit: async ({ value }) => {
      console.log("Form Values:", value);
      try {
        await createAlerts.mutateAsync(value);
      } catch (error) {
        console.error("Failed to create alert:", error);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <div className="bg-gray-800 scrollbar-hide max-h-[calc(100vh-8rem)] p-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 ml-4">Price Alert</h2>
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-800 space-y-4 rounded-lg"
      >
        <form.Field name="name">
          {(field) => (
            <InputField
              label="Alert Name"
              placeholder="My Price Alert"
              name={field.name}
              field={field}
            />
          )}
        </form.Field>
        {watchlist ? (
          <div>
            <Label className="text-sm text-gray-400 mb-1">
              Stock Identifier
            </Label>
            <div className="p-3 bg-gray-800/35 border rounded-lg text-white">
              {stockIdentifier || "N/A"}.
            </div>
          </div>
        ) : (
          <form.Field name="stockIdentifier">
            {(field) => (
              <SelectField
                label="Stock Identifier"
                name="stockIdentifier"
                placeholder="Select Stock"
                field={field}
                options={stocks.map((stock) => ({
                  value: stock.symbol,
                  label: stock.name + " (" + stock.symbol + ")",
                }))}
              />
            )}
          </form.Field>
        )}
        <form.Field name="type">
          {(field) => (
            <SelectField
              name={field.name}
              label="Type"
              options={alertOptions}
              placeholder="price or volume"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="condition">
          {(field) => (
            <SelectField
              name={field.name}
              label="Condition"
              options={[
                { value: "greater_than", label: "Greater Than " },
                { value: "less_than", label: "Less Than" },
                { value: "equal_to", label: "Equal To" },
              ]}
              placeholder="Select condition"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="threshold">
          {(field) => (
            <InputField
              name={field.name}
              label="Threshold"
              placeholder="$ e.g., 100"
              type="number"
              field={field}
            />
          )}
        </form.Field>
        <form.Field name="frequency">
          {(field) => (
            <SelectField
              name={field.name}
              label="Frequency"
              options={[
                { value: "once_per_minute", label: "Once per Minute" },
                { value: "once_per_hour", label: "Once per Hour" },
                { value: "once_per_day", label: "Once per Day" },
              ]}
              placeholder="Select frequency"
              field={field}
            />
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.isSubmitting, state.canSubmit]}
        >
          {([isSubmitting, canSubmit]) => (
            <Button
              className="yellow-btn w-full mt-5"
              disabled={isSubmitting || !canSubmit}
            >
              {isSubmitting ? <PulseLoader /> : "Create Alert"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};
export default AlertForm;
