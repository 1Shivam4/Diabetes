import styled from "styled-components";

export const SectionWrapper = styled.div`
  padding: 100px;
  height: 100vh;

  @media (max-width: 768px) {
    padding: 50px;
    height: 80vh;
  }

  @media (max-width: 480px) {
    padding: 20px;
    height: 60vh;
  }
`;

export const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;
export const FlexDivItem = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const HeadingH1 = styled.h1`
  font-size: 40px;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;
