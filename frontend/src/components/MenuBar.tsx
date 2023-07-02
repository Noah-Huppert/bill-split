import "react";
import SavingsIcon from '@mui/icons-material/Savings';
import styled from "styled-components";

import { COLORS } from "../styles";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes";

const MenuDiv = styled(Link)`
background: ${COLORS.primary};
color: ${COLORS.foreground};
padding: 1rem;
margin-bottom: 1rem;
display: flex;
align-items: center;
text-decoration: none;
`;

const MenuIcon = styled(SavingsIcon)`
margin-right: 1rem;
`;

const MenuTitle = styled.div`
font-size: 1.5rem;
`;

export function MenuBar() {
  return (
    <MenuDiv to={ROUTES.apex}>
        <MenuIcon fontSize="large" />
        <MenuTitle>Bill Split</MenuTitle>
    </MenuDiv>
  )
}