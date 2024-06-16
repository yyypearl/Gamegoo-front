import { theme } from "@/styles/theme";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import styled from "styled-components";

interface HeaderTitleProps {
  title: string;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ title }) => {
  const router = useRouter();

  return (
    <Header>
      <StyledImage
        onClick={() => router.back()}
        src="/assets/icons/left_arrow.svg"
        width={20}
        height={39}
        alt="back button"
      />
      <Title>{title}</Title>
    </Header>
  );
};

export default HeaderTitle;

const Header = styled.header`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 32px;
`;

const StyledImage = styled(Image)`
  margin-right: 35px;
  cursor: pointer;
`;

const Title = styled.h1`
  ${(props) => props.theme.fonts.bold32};
  color: ${theme.colors.gray100};
`;
