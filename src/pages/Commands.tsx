import Container from "@/components/Container";
import FixedCommands from "@/components/FixedCommands";
import MediaControlSettings from "@/components/MediaControlSettings";
import NavigationControlSettings from "@/components/NavigationControlSettings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Commands = () => {
  const [editing, setEditing] = useState(false);

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

        <div className="mt-2 gap-2 flex">
          <Button
            onClick={() => setEditing((curr) => !curr)}
            variant={"secondary"}
          >
            {editing ? "Done" : "Edit"}
          </Button>

          <Button variant={"secondary"}>Reset to default</Button>
        </div>

        {/* <Separator className="mt-4" /> */}

        {commandOptions.map((item) => (
          <TabsContent value={item.value} key={item.value}>
            <item.component editing={editing} />
          </TabsContent>
        ))}
      </Tabs>
    </Container>
  );
};

export default Commands;
