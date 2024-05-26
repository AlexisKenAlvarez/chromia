import Container from "@/components/Container";
import FixedCommands from "@/components/FixedCommands";
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
    {
      value: "Fixed Commands",
      component: FixedCommands,
    },
  ];

  return (
    <Container className="w-full h-full">
      <h1 className="font-bold">Available commands</h1>
      <Tabs defaultValue="media" className=" pb-5 mt-2">
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
