"use client";
import { useState } from "react";
import AlertForm from "./forms/alert-form";
import { Button, Icon, Shad } from "./ui";
import { cn } from "@/lib/utils";
import { Alert, Watchlist } from "@/types";

type Props = {
  watchlist?: Watchlist;
  alert?: Alert;
};

const AlertCommand = ({ watchlist, alert }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div>
        {alert ? (
          <Icon
            name="Pencil"
            className="size-4 text-gray-400 cursor-pointer"
            onClick={() => setOpen(true)}
          />
        ) : (
          <Button
            className={cn(
              "bg-yellow-500 hover:bg-yellow-500/85 rounded-sm px-3 text-sm h-9",
              {
                "bg-yellow-600/70 hover:bg-yellow-600 text-yellow-500":
                  !!watchlist,
              }
            )}
            onClick={() => setOpen(true)}
          >
            {watchlist ? "Add Alert" : "Create Alert"}
          </Button>
        )}
      </div>
      <div className="w-full max-w-md relative">
        <Shad.CommandDialog
          open={open}
          onOpenChange={setOpen}
          className="rounded-lg absolute top-2/5  left-1/2 -translate-x-1/2 w-full"
        >
          <AlertForm watchlist={watchlist} alert={alert} />
        </Shad.CommandDialog>
      </div>
    </div>
  );
};
export default AlertCommand;
