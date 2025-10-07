"use client";
import { useState } from "react";
import AlertForm from "./forms/alert-form";
import { Button, Shad } from "./ui";
import { cn } from "@/lib/utils";
import { Watchlist } from "@/types";

type Props = {
  watchlist?: Watchlist;
};

const AlertCommand = ({ watchlist }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div>
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
      </div>
      <div className="w-full max-w-md relative">
        <Shad.CommandDialog
          open={open}
          onOpenChange={setOpen}
          className="rounded-lg absolute top-2/5  left-1/2 -translate-x-1/2 w-full"
        >
          <AlertForm watchlist={watchlist} />
        </Shad.CommandDialog>
      </div>
    </div>
  );
};
export default AlertCommand;
