import Container from "@/components/Container";
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
      <Tabs defaultValue="media" className="mt-3">
        <TabsList className="w-full">
          <TabsTrigger value="media" className="w-full">
            Media
          </TabsTrigger>
          <TabsTrigger value="navigation" className="w-full">
            Navigation
          </TabsTrigger>
        </TabsList>

        {commandOptions.map((item) => (
          <TabsContent value={item.value}>
            <item.component />
          </TabsContent>
        ))}
      </Tabs>
    </Container>
  );
};

export default Commands;
