import "react";
import SavingsIcon from '@mui/icons-material/Savings';
import styled from "styled-components";

import { COLORS } from "../styles";

const MenuDiv = styled.div`
background: ${COLORS.primary};
color: ${COLORS.foreground};
padding: 1rem;
margin-bottom: 1rem;
display: flex;
align-items: center;
`;

const MenuIcon = styled(SavingsIcon)`
margin-right: 1rem;
`;

const MenuTitle = styled.div`
font-size: 1.5rem;
`;

export function MenuBar() {
  return (
    <MenuDiv>
      <MenuIcon fontSize="large" />
      <MenuTitle>Bill Split</MenuTitle>
    </MenuDiv>
  )
}