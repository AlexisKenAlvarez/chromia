import { Button } from "@/components/ui/button";
import Container from "../components/Container";
// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Welcome = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    chrome.storage.sync.get(["onBoarded"], (result) => {
      if (result.onBoarded) {
        navigate("/home");
      } else {
        setLoading(false);
      }
    });
    // navigate("/home");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="text-center">
      <div className="flex flex-col items-start justify-between h-full">
        <div className="space-y-7 ">
          <h2 className="font-bold">Welcome, Howdy?</h2>
          <svg
            width="150"
            height="150"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            <g clip-path="url(#clip0_120_8334)">
              <path
                d="M153.38 200H58.4106C41.7067 200 28.1177 186.411 28.1177 169.708C28.1177 153.005 41.7067 139.416 58.4106 139.416H169.644C181.946 139.416 191.955 129.407 191.955 117.104C191.955 104.802 181.946 94.7932 169.644 94.7932H32.1087C29.9044 94.7932 28.1181 93.0065 28.1181 90.8026C28.1181 88.5987 29.9044 86.812 32.1087 86.812H169.643C186.346 86.812 199.935 100.401 199.935 117.104C199.935 133.807 186.346 147.396 169.643 147.396H58.4106C46.1083 147.396 36.0989 157.405 36.0989 169.707C36.0989 182.01 46.1083 192.019 58.4106 192.019H153.38C155.584 192.019 157.37 193.805 157.37 196.009C157.37 198.213 155.583 200 153.38 200Z"
                fill="#9E9A9A"
              />
              <path
                d="M65.1701 25.5367C57.7545 -8.51208 8.61278 -8.51208 1.19717 25.5367C0.45498 28.9445 0.0639648 32.4835 0.0639648 36.1136C0.0639648 57.7065 13.8971 76.0655 33.1838 82.8209C52.4701 76.0659 66.3037 57.7065 66.3037 36.1136C66.3033 32.4831 65.9123 28.9445 65.1701 25.5367Z"
                fill="#F2CA7F"
              />
              <path
                d="M185.366 129.217C177.951 95.1678 128.809 95.1678 121.393 129.217C120.651 132.624 120.26 136.163 120.26 139.793C120.26 161.386 134.093 179.745 153.38 186.5C172.666 179.745 186.5 161.386 186.5 139.793C186.5 136.163 186.109 132.625 185.366 129.217Z"
                fill="#8CC1EA"
              />
              <path
                d="M33.1855 47.8183C41.1192 47.8183 47.5507 41.3867 47.5507 33.4531C47.5507 25.5194 41.1192 19.0879 33.1855 19.0879C25.2518 19.0879 18.8203 25.5194 18.8203 33.4531C18.8203 41.3867 25.2518 47.8183 33.1855 47.8183Z"
                fill="#79B1D6"
              />
              <path
                d="M153.38 151.501C161.314 151.501 167.745 145.07 167.745 137.136C167.745 129.202 161.314 122.771 153.38 122.771C145.446 122.771 139.015 129.202 139.015 137.136C139.015 145.07 145.446 151.501 153.38 151.501Z"
                fill="#E0B76E"
              />
            </g>
            <defs>
              <clipPath id="clip0_120_8334">
                <rect width="200" height="200" fill="white" />
              </clipPath>
            </defs>
          </svg>

          <div className="space-y-2">
            <h1 className="font-bold text-lg">
              Let&apos;s <span className="text-primary">personalize</span> your
              commands!
            </h1>
            <p className="text-sm">
              This extension is designed to help you navigate the web using your
              voice. To get started, click the button below.
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={() => {
            chrome.storage.sync.set({ onBoarded: true }, () => {});
            navigate("/home");
          }}
        >
          Get Started
        </Button>
      </div>
    </Container>
  );
};

export default Welcome;
