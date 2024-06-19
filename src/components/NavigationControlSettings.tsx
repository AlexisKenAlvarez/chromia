import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCommandValues } from "@/store/commandsStore";
import { AnimatePresence, motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { cn } from "@/utils/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const NavigationControlSettings = () => {
  const [editing, setEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const setDefault = useCommandValues((state) => state.setNavigationDefault);

  const navigationCommands = useCommandValues(
    (state) => state.navigationCommands
  );

  const mediaCommands = useCommandValues(
    (state) => state.mediaCommands
  );

  const [addingTo, setAddingTo] = useState("");

  const setNavigationCommands = useCommandValues(
    (state) => state.setNavigationCommands
  );
  const deleteNavigationCommand = useCommandValues(
    (state) => state.deleteNavigationCommand
  );

  const newCommandForm = z.object({
    command: z
      .string()
      .min(3, {
        message: "Command must be at least 3 characters",
      })
      .max(15),
  });

  type commandType = z.infer<typeof newCommandForm>;

  const form = useForm<commandType>({
    resolver: zodResolver(newCommandForm),
    defaultValues: {
      command: "",
    },
  });

  function onSubmit(values: commandType) {

    const existing1 = mediaCommands.map((item) => item.command).flat().find((item) => item === values.command)
    const existing2 = navigationCommands.map((item) => item.command).flat().find((item) => item === values.command)
    const existing3 = values.command === "search" || values.command === "open" || values.command === "go to"

    if (existing1 || existing2 || existing3) {
      form.setError("command", {
        type: "manual",
        message: "Command already exists",
      });
      return;
    }

    setNavigationCommands({ command: values.command, label: addingTo });

    chrome.storage.sync.set(
      {
        navigationCommands: [
          ...navigationCommands.map((item) => {
            if (item.label === addingTo) {
              return {
                command: [...item.command, values.command],
                label: item.label,
              };
            }

            return {
              command: item.command,
              label: item.label,
            };
          }),
        ],
      },
      function () {
        console.log("SINET ULET MEDIA COMMANDS 2");
      }
    );

    setAddingTo("");
  }

  return (
    <>
      <div className="mt-2 gap-2 flex">
        <Button
          onClick={() => setEditing((curr) => !curr)}
          variant={"secondary"}
        >
          {editing ? "Done" : "Edit"}
        </Button>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant={"secondary"}>Reset to default</Button>
          </DialogTrigger>
          <DialogContent onInteractOutside={() => setDialogOpen(false)}>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This will reset all navigation commands to their default values.
              </DialogDescription>

              <div className="w-full flex !mt-8 gap-3">
                <DialogClose className="w-full bg-gray-100 rounded-lg font-primary text-sm font-medium">
                  Cancel
                </DialogClose>
                <Button
                  onClick={() => {
                    chrome.storage.sync.remove(
                      "navigationCommands",
                      function () {}
                    );

                    setDefault();
                    setDialogOpen(false);
                  }}
                  className="w-full"
                >
                  Confirm
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2 mt-2">
        {navigationCommands.map((item, index) => (
          <div className="rounded-md bg-gray-50 p-2" key={index}>
            <div className="flex items-center gap-1">
              <h2 className="text-xs font-medium mr-1 italic">Action: </h2>
              <h1 className="capitalize font-medium text-primary">
                {item.label}
              </h1>
            </div>
            <ul className="flex gap-1 mt-1 items-stretch flex-wrap">
              <h1 className="text-xs font-medium mr-1 italic">Command: </h1>
              {item.command.map((cmd) => (
                <li className="relative group" key={cmd}>
                  <button
                    className={cn("hidden absolute -right-1 -top-1 opacity-0", {
                      "opacity-100 block": editing,
                    })}
                    onClick={() => {
                      chrome.storage.sync.set(
                        {
                          navigationCommands: [
                            ...navigationCommands.map((itm) => {
                              if (itm.label === item.label) {
                                return {
                                  command: itm.command.filter((c) => c !== cmd),
                                  label: itm.label,
                                };
                              }

                              return {
                                command: itm.command,
                                label: itm.label,
                              };
                            }),
                          ],
                        },
                        function () {
                          console.log("SINET ULET MEDIA COMMANDS 2");
                        }
                      );

                      deleteNavigationCommand({
                        command: cmd,
                        label: item.label,
                      });
                    }}
                  >
                    <CircleX size={18} color="red" fill="red" stroke="white" />
                  </button>
                  <Badge
                    className="flex h-full items-center rounded-md pb-1 px-4"
                    variant="outline"
                  >
                    <p className="">{cmd}</p>
                  </Badge>
                </li>
              ))}
              <Button
                className={cn("w-fit h-fit hidden ml-2 py-[2px]", {
                  block: editing,
                })}
                onClick={() => setAddingTo(item.label)}
              >
                +
              </Button>
            </ul>
          </div>
        ))}

        <AnimatePresence>
          {addingTo !== "" && (
            <motion.div
              key="changecommand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full absolute top-0 left-0 z-10 h-full bg-white/50 backdrop-blur-md px-5 flex  flex-col"
            >
              <h1 className="text-lg font-medium">
                Add a new command for {addingTo}.
              </h1>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="command"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Command</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Type your command here..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        setAddingTo("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Confirm</Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NavigationControlSettings;
