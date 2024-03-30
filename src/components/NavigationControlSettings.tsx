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

const NavigationControlSettings = () => {
  const navigationCommands = useCommandValues(
    (state) => state.navigationCommands
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
    <div className="space-y-4">
      {navigationCommands.map((item, index) => (
        <div className="" key={index}>
          <h1 className="capitalize font-medium">{item.label}</h1>
          <ul className="flex gap-1 mt-1 items-stretch flex-wrap">
            {item.command.map((cmd) => (
              <li className="relative group" key={cmd}>
                <button
                  className="absolute -right-1 -top-1 group-hover:opacity-100 opacity-0"
                  onClick={() => {
                    // chrome.storage.sync.set(
                    //   {
                    //     mediaCommands: [
                    //       ...mediaCommands.map((itm) => {
                    //         if (itm.label === item.label) {
                    //           return {
                    //             command: itm.command.filter((c) => c !== cmd),
                    //             label: itm.label,
                    //           };
                    //         }

                    //         return {
                    //           command: itm.command,
                    //           label: itm.label,
                    //         };
                    //       }),
                    //     ],
                    //   },
                    //   function () {
                    //     console.log("SINET ULET MEDIA COMMANDS 2");
                    //   }
                    // );

                    deleteNavigationCommand({
                      command: cmd,
                      label: item.label,
                    });
                  }}
                >
                  <CircleX size={18} color="red" fill="red" stroke="white" />
                </button>
                <Badge
                  className="flex h-full items-center px-4 rounded-md"
                  variant="outline"
                >
                  <p className="">{cmd}</p>
                </Badge>
              </li>
            ))}
            <Button
              className="w-fit h-fit py-2"
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

export default NavigationControlSettings;
