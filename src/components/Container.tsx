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
        "opacity-100 max-h-full overflow-hidden border relative",
        className
      )}
    >
      <div className="overflow-y-scroll w-full px-5 no-scroll py-3">{children}</div>
    </div>
  );
};

export default Container;
