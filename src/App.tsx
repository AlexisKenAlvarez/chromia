import { HashRouter, Route, Routes } from "react-router-dom";
import Commands from "./pages/Commands";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import WebList from "./pages/WebList";
import { Toaster } from "@/components/ui/sonner";

const App = () => {
  return (
    <div className="relative flex flex-col min-h-screen w-full min-w-[450px]">
      <Toaster />

      <div className="flex-1 flex w-full">
        <HashRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/commands" element={<Commands />} />
            <Route path="/weblist" element={<WebList />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default App;
