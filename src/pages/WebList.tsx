import Container from "@/components/Container";
import { WEBSITES } from "@/lib/constants";

const WebList = () => {
  return (
    <Container>
      <h1 className="text-lg font-medium">Websites list:</h1>
      <ul className="space-y-2">
        {WEBSITES.map((item, index) => (
          <li className="capitalize" key={item.name}>{index + 1}. {item.name}</li>
        ))}
      </ul>
    </Container>
  );
};

export default WebList;
