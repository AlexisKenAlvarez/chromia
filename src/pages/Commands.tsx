import Container from "@/components/Container";
import MediaControlSettings from "@/components/MediaControlSettings";
import NavigationControlSettings from "@/components/NavigationControlSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Commands = () => {
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
      <h1 className="font-bold text-center">Settings</h1>
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
