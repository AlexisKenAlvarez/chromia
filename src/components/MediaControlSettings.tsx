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

const MediaControlSettings = ({editing}: {editing: boolean}) => {
  const mediaCommands = useCommandValues((state) => state.mediaCommands);
  const [addingTo, setAddingTo] = useState("");

  const setMediaCommands = useCommandValues((state) => state.setMediaCommands);
  const deleteMediaCommand = useCommandValues(
    (state) => state.deleteMediaCommand
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
    setMediaCommands({ command: values.command, label: addingTo });

    chrome.storage.sync.set(
      {
        mediaCommands: [
          ...mediaCommands.map((item) => {
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
    <div className="space-y-3">
      {mediaCommands.map((item, index) => (
        <div className="" key={index}>
          <h1 className="capitalize font-medium">{item.label}</h1>
          <ul className="flex gap-1 mt-1 items-stretch flex-wrap">
            {item.command.map((cmd) => (
              <li className="relative group" key={cmd}>
                <button
                  className={cn("hidden absolute -right-1 -top-1 opacity-0", {
                    "opacity-100 block": editing,
                  })}
                  onClick={() => {
                    chrome.storage.sync.set(
                      {
                        mediaCommands: [
                          ...mediaCommands.map((itm) => {
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

                    deleteMediaCommand({ command: cmd, label: item.label });
                  }}
                >
                  <CircleX size={18} color="red" fill="red" stroke="white" />
                </button>
                <Badge
                  className="flex h-full items-center px-4 py-[9px] rounded-md"
                  variant="outline"
                >
                  <p className="">{cmd}</p>
                </Badge>
              </li>
            ))}
            <Button
              className={cn("w-fit h-fit py-2 hidden ml-2", {
                "block": editing,
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
  );
};

export default MediaControlSettings;
