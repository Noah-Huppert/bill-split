import { useState, useContext, useCallback, useEffect } from "react";
import { Breadcrumbs } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { ROUTES } from "../../routes";
import { trpc } from "../../trpc";
import { ErrorReporter } from "../../components/ErrorBoundary/ErrorBoundary";
import { Loading } from "../../components/Loading/Loading";
import { IBill } from "../../../../api/src/models/bill";

export function ViewBill() {
  const { id } = useParams();
  const reportError = useContext(ErrorReporter);

  if (!id) {
    reportError({
      userError: "Invalid URL",
      systemError: "id parameter is undefined",
    });
    return;
  }

  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState<IBill | null>(null);

  const fetchBill = useCallback(async () => {
    setBill(await trpc.billGet.query({ id }));
    setLoading(false);
  }, [setBill, setLoading]);

  useEffect(() => {
    fetchBill().catch((e) => reportError({
      userError: "Failed to get bill",
      systemError: e,
    }));
  }, [fetchBill, reportError])

  if (loading) {
    return (
      <Loading />
    )
  }

  if (!bill) {
    return (
      <div className="font-title">
        Bill Not Found
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs>
        <Link to={ROUTES.bills.list}>Bills</Link>
        <div>{bill.name}</div>
      </Breadcrumbs>
      Hello view bill
    </>
  );
}