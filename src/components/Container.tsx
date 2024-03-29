import { ReactNode } from "react";
import { cn } from "../utils/utils";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-[450px] h-[500px] py-3 opacity-100 max-h-full overflow-hidden  border flex items-center justify-center flex-col relative",
        className
      )}
    >
      <div className="overflow-y-scroll h-[90%] w-full px-5 no-scroll">{children}</div>
    </div>
  );
};

export default Container;
