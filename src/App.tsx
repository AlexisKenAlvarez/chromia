import { useEffect } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import Commands from "./pages/Commands";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import { useCommandValues } from "./store/commandsStore";

const App = () => {
  const mediaCommands = useCommandValues((state) => state.mediaCommands);
  // const updateMediaCommands = useCommandValues(
  //   (state) => state.updateMediaCommands
  // );

  useEffect(() => {
    chrome.storage.sync.get("mediaCommands", function (data) {
      if (data) {
        console.log("Data ", data);
        // updateMediaCommands(data.mediaCommands as typeof mediaCommands);
      }
    });

    // chrome.storage.sync.get("navigationCommands", function (data) {
    //   if (data) {
    //     useCommandValues.setState({
    //       navigationCommands:
    //         data.navigationCommands as typeof navigationCommands,
    //     });
    //   }
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaCommands]);

  return (
    <div className="w-[450px] h-[500px] relative">
      <div className="space-y-2 text-center">
        <h1 className="font-bold text-lg py-2">
          Google Chrome Extension for Navigation
        </h1>
      </div>

      <HashRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/commands" element={<Commands />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;
