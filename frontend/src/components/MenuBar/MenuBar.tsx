import "react";
import SavingsIcon from '@mui/icons-material/Savings';
import { Link } from "react-router-dom";

import { ROUTES } from "../../routes";
import "./MenuBar.scss";

export function MenuBar() {
  return (
    <Link
      to={ROUTES.apex}
      className="background-primary color-foreground menu-bar"
    >
        <SavingsIcon
          fontSize="large"
          className="icon"
        />
        <div className="font-title">
          Bill Split
        </div>
    </Link>
  )
}