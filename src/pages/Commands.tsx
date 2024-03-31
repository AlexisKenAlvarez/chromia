import Container from "@/components/Container";
import FixedCommands from "@/components/FixedCommands";
import MediaControlSettings from "@/components/MediaControlSettings";
import NavigationControlSettings from "@/components/NavigationControlSettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowBigLeftDash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Commands = () => {
  const navigate = useNavigate();
  const commandOptions = [
    {
      value: "media",
      component: MediaControlSettings,
    },
    {
      value: "navigation",
      component: NavigationControlSettings,
    },
    {
      value: "Fixed Commands",
      component: FixedCommands,
    },
  ];

  return (
    <Container>
      <div className="flex items-center gap-2 ">
        <Button
          variant="secondary"
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 mr-2"
        >
          <ArrowBigLeftDash size={28} strokeWidth={1} />
          <p className="">Back</p>
        </Button>
        <h1 className="font-bold">Settings</h1>
      </div>
      <Tabs defaultValue="media" className="mt-3 pb-5">
        <TabsList className="w-full">
          {commandOptions.map((item) => (
            <TabsTrigger
              value={item.value}
              key={item.value}
              className="w-full capitalize"
            >
              {item.value}
            </TabsTrigger>
          ))}
        </TabsList>

        {commandOptions.map((item) => (
          <TabsContent value={item.value} key={item.value}>
            <item.component />
          </TabsContent>
        ))}
      </Tabs>
    </Container>
  );
};

export default Commands;
