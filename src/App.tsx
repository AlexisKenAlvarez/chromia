import { HashRouter, Route, Routes } from "react-router-dom";
import Commands from "./pages/Commands";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";

const App = () => {
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
