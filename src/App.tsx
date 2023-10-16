import { BsFastForwardFill } from "react-icons/bs";
import { useState } from "react";

const App = () => {
  const [seekTime, handleSeekTime] = useState<number>(5);

  const handlePause = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      world: "MAIN",
      func: () => {
        const videoElem = document.querySelector("video");

        if (videoElem && videoElem instanceof HTMLVideoElement) {
          if (!videoElem.paused) {
            videoElem.pause();
          }
        }
      },
    });
  };

  const handlePlay = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      world: "MAIN",
      func: () => {
        const videoElem = document.querySelector("video");

        if (videoElem && videoElem instanceof HTMLVideoElement) {
          if (videoElem.paused) {
            videoElem.play();
          }
        }
      },
    });
  };

  const handleForward = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      world: "MAIN",
      func: () => {
        const videoElem = document.querySelector("video");

        if (videoElem && videoElem instanceof HTMLVideoElement) {
          videoElem.currentTime += seekTime;
        }
      },
    });
  }

  const handleBackward = async () => {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      world: "MAIN",
      func: () => {
        const videoElem = document.querySelector("video");

        if (videoElem && videoElem instanceof HTMLVideoElement) {
          videoElem.currentTime -= seekTime;
        }
      },
    });
  }

  return (
    <div className="w-[20rem] h-[25rem] bg-black p-10">
      <h1 className="text-white text-2xl text-center">
        Enhanced Youtube Experience
      </h1>
      <div className=" w-fit mx-auto mt-10 flex flex-col gap-5">
        <button className="bg-white px-5 py-2" onClick={handlePlay}>
          Play
        </button>
        <button className="bg-white px-5 py-2" onClick={handlePause}>
          Pause
        </button>
        <div className="flex gap-2">
          <button className="px-5 py-2 bg-white" onClick={handleBackward}>
            <BsFastForwardFill className="scale-x-[-1]" />
          </button>
          <button className="px-5 py-2 bg-white" onClick={handleForward}>
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

              handleSeekTime(value)
            }}
          />
          <h2 className="text-white text-center">Seek Time: {seekTime}</h2>
        </div>
      </div>
    </div>
  );
};

export default App;
