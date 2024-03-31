import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { WEBSITES } from "@/lib/constants";
import { ArrowBigLeftDash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebList = () => {
  const navigate = useNavigate();
  return (
    <Container>
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
      <ul className="space-y-2 mt-4">
        {WEBSITES.map((item, index) => (
          <li className="capitalize" key={item.name}>
            {index + 1}. {item.name}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default WebList;
