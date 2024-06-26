/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WEBSITES } from "@/lib/constants";
import { useCommandValues } from "@/store/commandsStore";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime/runtime";
import {
  cn,
  extractDomainName,
  isChromeExtensionURL,
  isValidURL,
} from "../utils/utils";
import Commands from "./Commands";
import WebList from "./WebList";

const Home = () => {
  const [previousWord, setPreviousWord] = useState("");
  const active = useCommandValues((state) => state.active);
  const hidden = useCommandValues((state) => state.hidden);
  const mediaCommands = useCommandValues((state) => state.mediaCommands);
  const updateNavigationCommands = useCommandValues(
    (state) => state.updateNavigationCommands
  );

  const updateMediaCommands = useCommandValues(
    (state) => state.updateMediaCommands
  );

  const navigationCommands = useCommandValues(
    (state) => state.navigationCommands
  );

  const openCommand = useCommandValues((state) => state.openCommand);
  const searchCommand = useCommandValues((state) => state.searchCommand);
  const setPendingCommand = useCommandValues(
    (state) => state.setPendingWebsites
  );

  const [seekTime, setSeekTime] = useState<number>(5);
  const [listening, setListening] = useState(false);
  const [exist, setExist] = useState<null | boolean>(null);
  const [iterated, setIterated] = useState(false);
  const [loading, setLoading] = useState(true);

  interface WebsitesInterface {
    command: string[];
    name: string;
    url: string;
  }

  const {
    transcript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    resetTranscript,
  } = useSpeechRecognition();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (transcript !== "") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        console.log("Word: ", transcript);
        console.log("Previous word: ", previousWord);

        if (active) setPreviousWord(transcript);
        resetTranscript();
      }, 850);
    }

    if (active) {
      mediaCommands.forEach((command) => {
        if (command.command.includes(transcript)) {
          command.callback();
          setPreviousWord("");
        }
      });

      navigationCommands.forEach((command) => {
        if (command.command.includes(transcript)) {
          command.callback();
          setPreviousWord("");
        }
      });

      if (openCommand.command.includes(previousWord.split(" ")[0])) {
        const word = previousWord.split(" ");
        openCommand.callback(word[word.length - 1]);
        setPreviousWord("");
      }

      if (searchCommand.command.includes(previousWord.split(" ")[0])) {
        const word = previousWord.split(" ").slice(1).join(" ");
        searchCommand.callback(word);
        setPreviousWord("");
      }
    } else {
      const reactivate = navigationCommands.filter(
        (command) => command.label === "Start listening"
      );

      if (reactivate[0].command.includes(transcript)) {
        console.log("Listening now!");
        setListening(true);
        useCommandValues.setState({ active: true });
        setPreviousWord("");
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect(() => {
    chrome.storage.sync.get(["websites"], function (data) {
      if (!data.websites) {
        chrome.storage.sync.set({ websites: WEBSITES }, () => {});
      }
    });
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach((tab, index) => {
        if (
          tab.title === "Voice Command Chrome Assistant" ||
          tab.title === "(1) Voice Command Chrome Assistant"
        ) {
          setExist(true);
        }
        if (tabs.length === index + 1) {
          setIterated(true);
        }
      });
      if (exist === null && iterated) {
        console.log("Mag create ng new tab");
        chrome.tabs.create({ url: "index.html" });
        // console.log("CREATE NEW TAB");
      } else {
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
              }
            }
          });
        });
      }
    });
  }, [exist, iterated]);

  useEffect(() => {


    void (async () => {
      if (listening) {
        useCommandValues.setState({ active: false });

        setListening(false);
        SpeechRecognition.abortListening();
      } else {
        await navigator.mediaDevices
          .getUserMedia({ audio: true, video: false })
          .then(function () {
            setListening(true);
            useCommandValues.setState({ active: true });
            SpeechRecognition.startListening({ continuous: true });
          })
          .catch(function (error) {
            window.chrome.tabs.create({
              url: "request-mic.html",
            });
            console.log(error);
          });
      }
    })();

    chrome.storage.sync.get("seekTime", function (data) {
      if (data.seekTime) {
        setSeekTime(data.seekTime);
      }
    });

    chrome.storage.sync.get("mediaCommands", function (data) {
      if (data.mediaCommands) {
        updateMediaCommands(data.mediaCommands as typeof mediaCommands);
      }
    });
    chrome.storage.sync.get("navigationCommands", function (data) {
      if (data.navigationCommands) {
        updateNavigationCommands(
          data.navigationCommands as typeof navigationCommands
        );
      }
    });

    const BLACKLIST = ["chrome://newtab/", "web"];
    chrome.tabs.onUpdated.addListener(function (_, __, tab) {
      const url = tab.url;
      const domainName = extractDomainName(url ?? "");

      chrome.storage.sync.get(["websites"], function (data) {
        const websites: WebsitesInterface[] = data.websites;
        const isExisting = websites?.some(
          (website) => website.name.toLowerCase() === domainName
        );
        if (
          !isExisting &&
          !BLACKLIST.includes(domainName) &&
          !isChromeExtensionURL(domainName) &&
          isValidURL(url ?? "")
        ) {
          document.title = "(1) Voice Command Chrome Assistant";
          setPendingCommand({
            command: [domainName.toLowerCase()],
            name: domainName,
            url: url ?? "",
          });
        } else {
          console.log("This website exists, ", domainName);
        }
      });
    });

    setLoading(false);
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="w-[450px] h-[500px] bg-black p-10 grid place-content-center text-center text-black">
        <span>Browser doesn't support speech recognition.</span>;
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="w-[20rem] h-[25rem] bg-black p-10 grid place-content-center text-center text-black">
        <span>
          Please allow us to use your microphone to access our full feature.
        </span>
        ;
      </div>
    );
  }

  if (loading) return null;

  return (
    <div
      className={cn(
        "w-full max-w-screen-xl mx-auto min-h-screen flex-col sm:flex hidden"
      )}
    >
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-lg py-2">
          Voice Command Chrome Assistant
        </h1>
      </div>

      <div className="flex justify-center flex-1">
        <Commands />

        <div
          className={cn(
            "p-10 w-full opacity-100 border transition-all ease-in-out duration-300 max-h-full overflow-hidden text-black flex flex-col pb-24",
            {
              "opacity-0 max-h-0 !p-0 w-0": hidden,
            }
          )}
        >
          <div className="">
            <svg
              width="80"
              height="94"
              viewBox="0 0 80 94"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.42857 32.0976C5.3221 32.0976 6.85714 33.6373 6.85714 35.5366V40.122C6.85714 58.4822 21.6957 73.3659 40 73.3659C58.3045 73.3659 73.1429 58.4822 73.1429 40.122V35.5366C73.1429 33.6373 74.6779 32.0976 76.5714 32.0976C78.4649 32.0976 80 33.6373 80 35.5366V40.122C80 61.122 63.915 78.3543 43.4286 80.0985V90.561C43.4286 92.4602 41.8935 94 40 94C38.1065 94 36.5714 92.4602 36.5714 90.561V80.0985C16.085 78.3543 0 61.122 0 40.122V35.5366C0 33.6373 1.53504 32.0976 3.42857 32.0976Z"
                fill="#1C274C"
              />
              <path
                opacity="0.5"
                d="M40.0006 0C25.4833 0 13.7148 11.8044 13.7148 26.3659V40.122C13.7148 54.6832 25.4833 66.4878 40.0006 66.4878C53.3555 66.4878 64.3846 56.4977 66.0646 43.561H44.572C42.6785 43.561 41.1434 42.0212 41.1434 40.122C41.1434 38.2227 42.6785 36.6829 44.572 36.6829H66.2863V29.8049H44.572C42.6785 29.8049 41.1434 28.2652 41.1434 26.3659C41.1434 24.4665 42.6785 22.9268 44.572 22.9268H66.0646C64.3846 9.99027 53.3555 0 40.0006 0Z"
                fill="#1C274C"
              />
              <path
                d="M41.1426 40.122C41.1426 42.0213 42.6777 43.561 44.5711 43.561H66.0637L66.2854 36.683H44.5711C42.6777 36.683 41.1426 38.2227 41.1426 40.122Z"
                fill="#1C274C"
              />
              <path
                d="M41.1426 26.3658C41.1426 28.2651 42.6777 29.8049 44.5711 29.8049H66.2854L66.0637 22.9268H44.5711C42.6777 22.9268 41.1426 24.4665 41.1426 26.3658Z"
                fill="#1C274C"
              />
            </svg>

            <h1 className="text-center text-lg font-bold mt-2">
              {active ? "Listening..." : "Not Listening"}
            </h1>
          </div>

          <div className="mt-4">
            <div
              className={cn(
                "w-28 h-14 rounded-full relative mx-auto bg-slate-300 grid place-content-center",
                {
                  "bg-green-400": active,
                }
              )}
            >
              <div
                className={cn(
                  "w-full h-full rounded-full absolute top-0 left-0 mx-auto bg-slate-300",
                  {
                    "animate-ping": transcript !== "",
                    "bg-green-400": active,
                  }
                )}
              ></div>
              {active && (
                <p className="relative z-10 text-sm text-white text-center">
                  {transcript}
                </p>
              )}
            </div>
            <Button
              className=" px-5 py-2 w-full mt-6"
              onClick={async () => {
                if (listening) {
                  useCommandValues.setState({ active: false });

                  setListening(false);
                  SpeechRecognition.abortListening();
                } else {
                  await navigator.mediaDevices
                    .getUserMedia({ audio: true, video: false })
                    .then(function () {
                      setListening(true);
                      useCommandValues.setState({ active: true });
                      SpeechRecognition.startListening({ continuous: true });
                    })
                    .catch(function (error) {
                      window.chrome.tabs.create({
                        url: "request-mic.html",
                      });
                      console.log(error);
                    });
                }
              }}
            >
              {active ? "Stop Listening" : "Start Listening"}
            </Button>
            <div className="text-center">
              <Slider
                className="mt-5"
                defaultValue={[seekTime]}
                value={[seekTime]}
                min={1}
                max={20}
                onValueChange={(value) => {
                  setSeekTime(value[0]);
                  chrome.storage.sync.set({ seekTime: value[0] }, () => {});
                }}
              />
              <div className="flex items-center justify-center mt-2 gap-1">
                <TooltipProvider delayDuration={1}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="opacity-50 cursor-pointer" size={14} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        The time to skip, works in most video media players such
                        as Youtube.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <p className="font-semibold">Seek time: {seekTime}</p>
              </div>
            </div>
          </div>
        </div>

        <WebList />
      </div>
    </div>
  );
};

export default Home;
