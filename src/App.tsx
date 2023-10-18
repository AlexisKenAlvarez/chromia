import { BsFastForwardFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import 'regenerator-runtime/runtime'

const App = () => {
  const [seekTime, handleSeekTime] = useState<number>(5);

  const {
    transcript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  console.log(transcript);

  useEffect(() => {
    SpeechRecognition.startListening({ continuous: false });
  }, []);

  const handlePlayback = async (type: string) => {
    let [tab] = await chrome.tabs.query({ active: true });
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

  const handleSeek = async (type: string) => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      world: "MAIN",
      func: (seekTime: number, type: string) => {
        const videoElem = document.querySelector("video");

        if (videoElem && videoElem instanceof HTMLVideoElement) {
          if (type === "backward") {
            videoElem.currentTime -= seekTime;
          } else {
            videoElem.currentTime += seekTime;
          }
        }
      },
      args: [seekTime, type],
    });
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="w-[20rem] h-[25rem] bg-black p-10 grid place-content-center text-center">
        <span>Browser doesn't support speech recognition.</span>;
      </div>
    );
  }

  if (!isMicrophoneAvailable) {
    return (
      <div className="w-[20rem] h-[25rem] bg-black p-10 grid place-content-center text-center">
        <span>Please allow us to use your microphone to access our full feature.</span>;
      </div>
    );
  }

  return (
    <div className="w-[20rem] h-[25rem] bg-black p-10">
      <h1 className="text-white text-2xl text-center">
        Enhanced Youtube Experience
      </h1>
      <div className=" w-fit mx-auto mt-10 flex flex-col gap-5">
        <button
          className="bg-white px-5 py-2"
          onClick={() => {
            handlePlayback("play");
          }}
        >
          Play
        </button>
        <button
          className="bg-white px-5 py-2"
          onClick={() => {
            handlePlayback("pause");
          }}
        >
          Pause
        </button>
        <div className="flex gap-2 justify-center w-full">
          <button
            className="px-5 py-2 bg-white w-full"
            onClick={() => {
              handleSeek("backward");
            }}
          >
            <BsFastForwardFill className="scale-x-[-1]" />
          </button>
          <button
            className="px-5 py-2 bg-white w-full"
            onClick={() => {
              handleSeek("forward");
            }}
          >
            <BsFastForwardFill />
          </button>
        </div>
        <div className="">
          <input
            type="range"
            min={1}
            max={10}
            defaultValue={seekTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = parseInt(e.target.value);

              handleSeekTime(value);
            }}
          />
          <h2 className="text-white text-center">Seek Time: {seekTime}</h2>
        </div>
      </div>
    </div>
  );
};

export default App;
