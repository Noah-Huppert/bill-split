import { Breadcrumbs } from "@mui/material";
import "react";
import { Link } from "react-router-dom";

export function CreateBill() {
  return (
    <>
      <Breadcrumbs>
        <Link to="/bills">Bills</Link>
        <div>Create</div>
      </Breadcrumbs>
    </>
  )
}