/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface StorageCommand {
  command: string[];
  label: string;
}

interface CommandStore {
  pendingWebsites: {
    name: string;
    command: string[];
    url: string;
  }[];

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
  openCommand: {
    command: string[];
    label: string;
    callback: (website: string) => void;
  };
  searchCommand: {
    command: string[];
    label: string;
    callback: (term: string) => void;
  };

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
  updateNavigationCommands: (updated: StorageCommand[]) => void;

  deleteMediaCommand: ({
    command,
    label,
  }: {
    command: string;
    label: string;
  }) => void;
  deleteNavigationCommand: ({
    command,
    label,
  }: {
    command: string;
    label: string;
  }) => void;
  active: boolean;
  setPendingWebsites: (websites: CommandStore["pendingWebsites"][0]) => void;
  removePendingWebsites: () => void;
  ignoreList: string[];
  setIgnoreList: () => void;
}

export const useCommandValues = create<CommandStore>()((set) => ({
  active: false,
  hidden: false,
  setHidden: (value: boolean) => set(() => ({ hidden: value })),

  ignoreList: [],
  pendingWebsites: [],
  setPendingWebsites: (websites: CommandStore["pendingWebsites"][0]) =>
    set((state) => {
      const exists = state.pendingWebsites.some(
        (val) => val.name === websites.name
      );

      if (exists) {
        return state;
      }

      const inIgnored = state.ignoreList.some((val) => val === websites.name);

      if (inIgnored) {
        return state;
      }

      return {
        pendingWebsites: [...state.pendingWebsites, websites],
      };
    }),

  removePendingWebsites: () =>
    set(() => ({
      pendingWebsites: [],
    })),
  setIgnoreList: () => {
    set((state) => ({
      ignoreList: [...state.pendingWebsites.map((site) => site.name)],
    }));
  },
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
      command: ["skip", "forward"],
      label: "skip",
      callback: () => {
        handleSeek("forward");
      },
    },
    {
      command: ["rewind",],
      label: "rewind",
      callback: () => {
        handleSeek("backward");
      },
    },
    {
      command: ["next"],
      label: "Next Video",
      callback: () => {
        handleNext();
      },
    },
    {
      command: ["fullscreen", "full screen"],
      label: "fullscreen",
      callback: () => {
        handleFullScreen("full");
      },
    },
    {
      command: ["exit"],
      label: "Exit fullscreen",
      callback: () => {
        handleFullScreen("exit");
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

  deleteMediaCommand: ({
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
            command: item.command.filter((cmd: string) => cmd !== command),
            label: label,
            callback: item.callback,
          };
        }
        return item;
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
      command: ["next slide"],
      label: "Next slide",
      callback: () => {
        handlePage("next");
      },
    },
    {
      command: ["previous slide"],
      label: "Previous slide",
      callback: () => {
        handlePage("back");
      },
    },
    {
      command: ["back"],
      label: "Go back",
      callback: async () => {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tab && tab.id) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              window.history.back();
            },
          });
        }
      },
    },
    {
      command: ["scroll up"],
      label: "Scroll up",
      callback: () => {
        handleScroll("up");
      },
    },
    {
      command: ["scroll down"],
      label: "Scroll down",
      callback: () => {
        handleScroll("down");
      },
    },
    {
      command: ["refresh", "reload"],
      label: "Reload Page",
      callback: () => {
        chrome.tabs.query(
          { active: true, windowType: "normal" },
          (arrayOfTabs) => {
            if (arrayOfTabs.length > 0 && arrayOfTabs[0].id) {
              chrome.tabs?.reload(arrayOfTabs[0].id, {});
            }
          }
        );
      },
    },
    {
      command: ["open commands", "show"],
      label: "Open Commands",
      callback: () => {
        try {
          chrome.tabs.query({}, (tabs) => {
            // Assuming you want to switch to the first tab found

            tabs.forEach((tab) => {
              if (
                tab.title === "(1) Voice Command Chrome Assistant" ||
                tab.title === "Voice Command Chrome Assistant"
              ) {
                const id = tab.id;

                if (id) {
                  chrome.tabs.update(id, { active: true });
                  window.location.hash = "#/commands";
                }
              }
            });

            // Update the tab to make it active
          });
        } catch (error) {
          console.log(error);
        }
      },
    },
    {
      command: ["close tab"],
      label: "Close tab",
      callback: () => {
        try {
          chrome.tabs.query(
            { currentWindow: true, active: true },
            function (tabs) {
              chrome.tabs.remove(tabs[0].id!, function () {});
            }
          );
        } catch (error) {
          console.log(error);
          console.log("No tab to close");
        }
      },
    },
  ],
  deleteNavigationCommand: ({
    command,
    label,
  }: {
    command: string;
    label: string;
  }) =>
    set((state) => ({
      navigationCommands: state.navigationCommands.map((item) => {
        if (item.label === label) {
          return {
            command: item.command.filter((cmd: string) => cmd !== command),
            label: label,
            callback: item.callback,
          };
        }
        return item;
      }),
    })),

  setNavigationCommands: ({
    command,
    label,
  }: {
    command: string;
    label: string;
  }) =>
    set((state) => ({
      navigationCommands: state.navigationCommands.map((item) => {
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
  updateNavigationCommands: (updated: StorageCommand[]) =>
    set((state) => ({
      navigationCommands: state.navigationCommands.map((navigationCommand) => {
        const updatedCommand = updated.find(
          (updatedCommand) => updatedCommand.label === navigationCommand.label
        );

        if (updatedCommand) {
          return { ...navigationCommand, command: updatedCommand.command };
        }
        return navigationCommand;
      }),
    })),
  openCommand: {
    command: ["open", "go"],
    label: "open",
    callback: (website: string) => {
      chrome.storage.sync.get(["websites"], function (data) {
        data.websites.map((site: { url: string; command: string[] }) => {
          if (site.command.includes(website)) {
            chrome.tabs.create({ url: site.url });
          }
        });
      });
    },
  },
  searchCommand: {
    command: ["search"],
    label: "search",
    callback: (term: string) => {
      try {
        chrome.tabs.query(
          { currentWindow: true, active: true },
          function (tabs) {
            const url = new URL(tabs[0].url!).origin;

            if (url === "https://www.youtube.com") {
              chrome.tabs.create({
                url: `${url}/results?search_query=${term}`,
              });
            } else if (url === "https://www.facebook.com") {
              chrome.tabs.create({ url: `${url}/search/top?q=${term}` });
            } else {
              chrome.tabs.create({
                url: `https://www.google.com/search?q=${term}`,
              });
            }
          }
        );
      } catch (error) {
        console.log(error);
        console.log("No tab to close");
      }
    },
  },
}));

const handleScroll = async (type: string) => {
  const [tab] = await chrome.tabs.query({ active: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    world: "MAIN",
    func: (type: string) => {
      if (type === "down") {
        window.scrollBy(0, window.innerHeight);
      } else {
        window.scrollBy(0, -window.innerHeight);
      }
    },
    args: [type],
  });
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

const handleFullScreen = async (type: string) => {
  const [tab] = await chrome.tabs.query({ active: true });
  console.log("🚀 ~ handleFullScreen ~ tab:", tab);

  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    world: "MAIN",
    func: (type) => {
      const videoElem = document.querySelector("video");

      if (videoElem && videoElem instanceof HTMLVideoElement) {
        if (type === "exit") {
          document.exitFullscreen();
        } else {
          if (videoElem.requestFullscreen) videoElem.requestFullscreen();
        }
      }
    },
    args: [type],
  });
};

const handleSeek = async (type: "backward" | "forward") => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.id) {
    chrome.storage.sync.get(["seekTime"], function (data) {
      const seekTime = data.seekTime || 5; // Default to 5 seconds if not set

      chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        world: "MAIN",
        func: (type: "backward" | "forward", seekTime: number) => {
          const videoElem = document.querySelector("video");

          if (videoElem && videoElem instanceof HTMLVideoElement) {
            if (type === "backward") {
              videoElem.currentTime -= seekTime;
            } else {
              videoElem.currentTime += seekTime;
            }
          }
        },
        args: [type, seekTime],
      });
    });
  }
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

        try {
          const box = elementToClick?.getBoundingClientRect(),
            coordX = box.left + (box.right - box.left) / 2,
            coordY = box.top + (box.bottom - box.top) / 2;

          simulateMouseEvent(elementToClick, "mousedown", coordX, coordY);
          simulateMouseEvent(elementToClick, "mouseup", coordX, coordY);
          simulateMouseEvent(elementToClick, "click", coordX, coordY);
        } catch (error) {
          console.log(error);
        }
      } else {
        const elementToClick = document.querySelectorAll("div[role=button]")[0];

        try {
          // Check if the element has an onclick attribute
          const box = elementToClick?.getBoundingClientRect(),
            coordX = box.left + (box.right - box.left) / 2,
            coordY = box.top + (box.bottom - box.top) / 2;

          simulateMouseEvent(elementToClick, "mousedown", coordX, coordY);
          simulateMouseEvent(elementToClick, "mouseup", coordX, coordY);
          simulateMouseEvent(elementToClick, "click", coordX, coordY);
        } catch (error) {
          console.log(error);
        }
      }
    },
    args: [type],
  });
};

const handleNext = async () => {
  const [tab] = await chrome.tabs.query({ active: true });
  console.log(tab);
  chrome.scripting.executeScript({
    target: { tabId: tab.id!, allFrames: true },
    world: "MAIN",

    func: () => {
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

      const elementToClick = document.getElementsByClassName(
        "ytp-next-button ytp-button"
      )[0];

      // Check if the element has an onclick attribute
      const box = elementToClick.getBoundingClientRect(),
        coordX = box.left + (box.right - box.left) / 2,
        coordY = box.top + (box.bottom - box.top) / 2;

      simulateMouseEvent(elementToClick, "mousedown", coordX, coordY);
      simulateMouseEvent(elementToClick, "mouseup", coordX, coordY);
      simulateMouseEvent(elementToClick, "click", coordX, coordY);
    },
  });
};
