import React from "react";
import { FlexDiv, SectionWrapper } from "./CommonStyles";

export default function MainContainer({ children }) {
  return (
    <SectionWrapper>
      <FlexDiv>{children}</FlexDiv>
    </SectionWrapper>
  );
}
