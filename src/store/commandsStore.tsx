/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface StorageCommand {
  command: string[];
  label: string;
}

interface CommandStore {
  hidden: boolean;
  setHidden: (value: boolean) => void;
  mediaCommands: {
    command: string[];
    label: string;
    callback: () => void;
  }[];
  navigationCommands: {
    command: string[];
    label: string;
    callback: () => void;
  }[];
  setMediaCommands: ({
    command,
    label,
  }: {
    command: string;
    label: string;
  }) => void;
  setNavigationCommands: ({
    command,
    label,
  }: {
    command: string;
    label: string;
  }) => void;
  updateMediaCommands: (updated: StorageCommand[]) => void;
}

export const useCommandValues = create<CommandStore>()((set) => ({
  hidden: false,
  setHidden: (value: boolean) => set(() => ({ hidden: value })),

  // Media Commands
  mediaCommands: [
    {
      command: ["pause", "tigil"],
      label: "pause",
      callback: () => {
        handlePlayback("pause");
      },
    },
    {
      command: ["play", "tuloy", "start"],
      label: "play",
      callback: () => {
        handlePlayback("play");
      },
    },
    {
      command: ["skip"],
      label: "skip",
      callback: () => {
        handleSeek("forward");
      },
    },
    {
      command: ["rewind"],
      label: "rewind",
      callback: () => {
        handleSeek("backward");
      },
    },
  ],

  updateMediaCommands: (updated: StorageCommand[]) =>
    set((state) => ({
      mediaCommands: state.mediaCommands.map((mediaCommand) => {
        const updatedCommand = updated.find(
          (updatedCommand) => updatedCommand.label === mediaCommand.label
        );

        if (updatedCommand) {
          return { ...mediaCommand, command: updatedCommand.command };
        }
        return mediaCommand;
      }),
    })),

  setMediaCommands: ({ command, label }: { command: string; label: string }) =>
    set((state) => ({
      mediaCommands: state.mediaCommands.map((item) => {
        if (item.label === label) {
          return {
            command: [...item.command, command],
            label: label,
            callback: item.callback,
          };
        }
        return item;
      }),
    })),

  // Navigation Commands
  navigationCommands: [
    {
      command: ["next"],
      label: "Next slide",
      callback: () => {
        handlePage("next");
      },
    },
    {
      command: ["back"],
      label: "Previous slide",
      callback: () => {
        handlePage("back");
      },
    },
    {
      command: ["hide"],
      label: "Hide UI",
      callback: () => {
        handleUI("hide");
      },
    },
    {
      command: ["show"],
      label: "Show UI",
      callback: () => {
        handleUI("show");
      },
    },
  ],
  setNavigationCommands: ({
    command,
    label,
  }: {
    command: string;
    label: string;
  }) =>
    set((state) => ({
      mediaCommands: state.mediaCommands.map((item) => {
        if (item.label === label) {
          return {
            command: [...item.command, command],
            label: label,
            callback: item.callback,
          };
        }
        return item;
      }),
    })),
}));

const handleUI = (type: "show" | "hide") => {
  // if (type === "show") {
  //   useCommandValues.setState({ hidden: false });
  // } else {
  //   useCommandValues.setState({ hidden: true });
  // }
  console.log(type);
};

const handlePlayback = async (type: "pause" | "play") => {
  const [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    world: "MAIN",
    func: (type) => {
      const videoElem = document.querySelector("video");

      if (videoElem && videoElem instanceof HTMLVideoElement) {
        if (!videoElem.paused && type === "pause") {
          videoElem.pause();
        } else {
          videoElem.play();
        }
      }
    },
    args: [type],
  });
};

const handleSeek = async (type: "backward" | "forward") => {
  const [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    world: "MAIN",
    func: (type: string) => {
      const videoElem = document.querySelector("video");

      if (videoElem && videoElem instanceof HTMLVideoElement) {
        if (type === "backward") {
          videoElem.currentTime -= 5;
        } else {
          videoElem.currentTime += 5;
        }
      }
    },
    args: [type],
  });
};

const handlePage = async (type: string) => {
  const [tab] = await chrome.tabs.query({ active: true });
  console.log(tab);
  chrome.scripting.executeScript({
    target: { tabId: tab.id!, allFrames: true },
    world: "MAIN",

    func: (type: string) => {
      const simulateMouseEvent = function (
        element: any,
        eventName: any,
        coordX: any,
        coordY: any
      ) {
        element.dispatchEvent(
          new MouseEvent(eventName, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: coordX,
            clientY: coordY,
            button: 0,
          })
        );
      };

      if (type === "next") {
        const elementToClick = document.querySelectorAll("div[role=button]")[1];
        console.log(document.querySelectorAll("div[role=button]"));

        // Check if the element has an onclick attribute
        const box = elementToClick.getBoundingClientRect(),
          coordX = box.left + (box.right - box.left) / 2,
          coordY = box.top + (box.bottom - box.top) / 2;

        simulateMouseEvent(elementToClick, "mousedown", coordX, coordY);
        simulateMouseEvent(elementToClick, "mouseup", coordX, coordY);
        simulateMouseEvent(elementToClick, "click", coordX, coordY);
      } else {
        const elementToClick = document.querySelectorAll("div[role=button]")[0];

        // Check if the element has an onclick attribute
        const box = elementToClick.getBoundingClientRect(),
          coordX = box.left + (box.right - box.left) / 2,
          coordY = box.top + (box.bottom - box.top) / 2;

        simulateMouseEvent(elementToClick, "mousedown", coordX, coordY);
        simulateMouseEvent(elementToClick, "mouseup", coordX, coordY);
        simulateMouseEvent(elementToClick, "click", coordX, coordY);
      }
    },
    args: [type],
  });
};
