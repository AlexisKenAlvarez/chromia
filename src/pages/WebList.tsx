import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCommandValues } from "@/store/commandsStore";
import { ArrowBigLeftDash } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Commands {
  name: string;
  command: string[];
  url: string;
}
[];

const WebList = () => {
  const [websites, setWebsites] = useState<Commands[]>();
  const navigate = useNavigate();

  const pendingCommands = useCommandValues((state) => state.pendingWebsites);
  const ignorePending = useCommandValues((state) => state.setIgnoreList);
  const removePending = useCommandValues(
    (state) => state.removePendingWebsites
  );
  useEffect(() => {
    chrome.storage.sync.get(["websites"], (result) => {
      setWebsites(result.websites);
    });
  }, []);

  return (
    <Container className="">
      {pendingCommands.length > 0 && (
        <div className="w-full bg-white h-full z-10 absolute top-0 left-0 p-10 space-y-3">
          <h1 className="text-lg font-medium">New websites detected</h1>
          <p className="text-sm opacity-70">
            These are the websites you visited while Chromia was active that are
            not yet included on the list.
          </p>
          <Separator />
          <ul className="overflow-y-scroll h-64">
            {pendingCommands.map((item, index) => (
              <li className="" key={item.name}>
                {index + 1}. {item.name}
              </li>
            ))}
          </ul>
          <Separator />

          <div className="flex gap-2">
            <Button
              className="w-full"
              onClick={() => {
                chrome.storage.sync.get(["websites"], (result) => {
                  chrome.storage.sync.set(
                    { websites: [...result.websites, ...pendingCommands] },
                    () => {
                      document.title = "Voice Command Chrome Assistant";
                      removePending();
                      navigate("/home");
                    }
                  );
                });
              }}
            >
              {pendingCommands.length > 1 ? "Add all" : "Add"}
            </Button>
            <Button
              variant="secondary"
              className="ml-2 w-full"
              onClick={() => {
                document.title = "Voice Command Chrome Assistant";

                ignorePending();
                removePending();
                navigate("/home");
              }}
            >
              Ignore
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 sticky top-0 bg-white pb-2">
        <Button
          variant="secondary"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 mr-2"
        >
          <ArrowBigLeftDash size={28} strokeWidth={1} />
          <p className="">Back</p>
        </Button>
        <h1 className="font-bold">Website List</h1>
      </div>

      <div className="space-y-2">
        <Separator />
        <p className="">
          <span className="font-bold">1.</span> Use command{" "}
          <span className="font-bold">
            &apos;open/go to &#91;website to open&#93;&apos;
          </span>
        </p>

        {/* <div className="flex items-center gap-2 mt-2">
          <Switch
            id="auto-mode"
            onCheckedChange={(val: boolean) => {
              chrome.storage.sync.set({ autoMode: val });
            }}
          />
          <Label htmlFor="auto-mode">Auto add websites</Label>
        </div> */}
        <p className="text-sm opacity-70">
          When this is checked, it will automatically add websites you visit to
          the list below without asking for confirmation.
        </p>
        <Separator />
      </div>

      <ul className="space-y-2 mt-4">
        {websites?.map((item, index) => (
          <li className="capitalize" key={item.name}>
            {index + 1}. {item.name}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default WebList;
