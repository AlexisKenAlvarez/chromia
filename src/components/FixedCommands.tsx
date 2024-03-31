import { Separator } from "./ui/separator";
import { ScanSearch, AppWindow } from "lucide-react";

const FixedCommands = () => {
  return (
    <ol className="space-y-4 mt-4">
      <li className="">
        <h1 className="font-medium flex space-x-1 items-center">
          <ScanSearch size={16} />
          <p className="text-lg text-primary">Searching</p>
        </h1>
        <div className="space-y-2">
          <p className="">
            <span className="font-bold">1.</span> Use command{" "}
            <span className="font-bold">
              &apos;search &#91;word to search&#93;&apos;
            </span>
          </p>
          <p className="">
            <span className="font-bold">2.</span> Searching only works for
            Facebook, Youtube, and Google.
          </p>
          <p className="">
            <span className="font-bold">3.</span> The search will be based on
            which tab you are currently in. If you are on Facebook, it will
            search on{" "}
            <span className="font-bold space-x-1">
              <em>Facebook</em>
              <img
                src="/logos/facebook_logo.webp"
                alt="Facebook"
                className="w-4 inline-block -mt-1"
              />
            </span>
            . If you are on YouTube, it will search on{" "}
            <span className="font-bold space-x-1">
              <em className="">Youtube</em>
              <img
                src="/logos/youtube_logo.webp"
                alt="Youtube"
                className="w-5 inline-block"
              />
            </span>
            . If you are not on either of these, it will search using{" "}
            <span className="font-bold space-x-1">
              <em className="inline">Google</em>
              <img
                src="/logos/google_logo.webp"
                alt="Google"
                className="w-4 inline-block"
              />
            </span>
            .
          </p>
        </div>
      </li>
      <Separator />
      <li className="">
        <h1 className="font-medium flex space-x-1 items-center">
          <AppWindow size={16} />
          <p className="text-lg text-primary">Open new tab</p>
        </h1>
        <div className="space-y-2">
          <p className="">
            <span className="font-bold">1.</span> Use command{" "}
            <span className="font-bold">
              &apos;open/go to &#91;website to open&#93;&apos;
            </span>
          </p>
          <p className="">
            <span className="font-bold">2. </span>We currently support limited
            number of websites.{" "}
            <span className="italic underline cursor-pointer">
              View website list
            </span>
          </p>
        </div>
      </li>
    </ol>
  );
};

export default FixedCommands;
