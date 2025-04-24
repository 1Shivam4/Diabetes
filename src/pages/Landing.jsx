import React from "react";
import logo from "../assets/B-Photoroom.png";
import Button from "../components/ui/Button";
import { FlexDiv, FlexDivItem, HeadingH1 } from "../components/ui/CommonStyles";
import MainContainer from "../components/ui/MainContainer";
import DBGIF from "/assets/output-onlinegiftools.gif";
import { Link } from "react-router-dom";

const buttons = [
  {
    type: "Login",
    path: "/login",
    bgColor: "bg-blue-500 text-white hover:bg-blue-600",
  },
  {
    type: "Register",
    path: "/register",
    bgColor: "bg-white border-2 border-slate-200 text-black hover:bg-gray-200",
  },
];

export default function Landing() {
  return (
    <MainContainer>
      <FlexDivItem className="d-flex flex-col gap-4 md:gap-8 text-center">
        <div className="p-2 border-2 border-blue-200 rounded-full">
          <img src={logo} className="h-28 md:h-36" />
        </div>
        <HeadingH1>AI-Powered Diabetes Prediction</HeadingH1>
        <img src={DBGIF} className="block md:hidden h-48" />
        <p className="text-sm sm:text-xl font-sans">
          🚀 Early detection can save lives! Our advanced AI model analyzes key
          health indicators to predict t likelihood of diabetes—quickly and
          accurately.
        </p>
        <FlexDiv className="gap-4">
          {buttons.map((btn, i) => (
            <Button key={i} bgcolor={btn.bgColor}>
              <Link to={btn.path}>
                <p className="font-semibold text-xl ">{btn.type}</p>
              </Link>
            </Button>
          ))}
        </FlexDiv>
      </FlexDivItem>
      <FlexDivItem>
        <img src={DBGIF} className="hidden md:block" />
      </FlexDivItem>
    </MainContainer>
  );
}
