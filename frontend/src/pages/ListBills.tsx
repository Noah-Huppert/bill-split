import { useEffect, useState, useContext, useCallback } from "react";
import KayakingIcon from '@mui/icons-material/Kayaking';
import { Button, CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import styled from "styled-components";

import { trpc } from "../App";
import { ErrorReporter } from "../components/ErrorBoundary";
import { IBill } from "../../../api/src/models/bill";
import { COLORS } from "../styles";
import { Link } from "react-router-dom";
import { ROUTES } from "../routes";

const NotFoundContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
`;

const NotFoundMsg = styled.p`
font-size: 2rem;
`;

const Header = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`;

const Title = styled.div`
font-size: 2rem;
`;

const CreateButton = styled(Button)`
background: ${COLORS.secondary} !important;
`;

const CreateButtonText = styled.div`
margin-left: 0.5rem;
`;

export function ListBills() {
  return (
		<>
			<Header>
				<Title>
					Bills
				</Title>
				<Link to={ROUTES.bills.create}>
				<CreateButton variant="contained">
					<AddBusinessIcon fontSize="medium" />
					<CreateButtonText>
						New Bill
					</CreateButtonText>
				</CreateButton>
				</Link>
			</Header>
			<BillsList />
		</>
	);
}

function BillsList() {
	const [bills, setBills] = useState<ReturnType<trpc.billList.query>[]>([]);
  const showError = useContext(ErrorReporter);

  const fetchBills = useCallback(async () => {
    setBills(await trpc.billList.query());
  }, [setBills]);
  useEffect(() => {
    fetchBills().catch((e) => showError({
		userError: "Failed to get bills",
		systemError: e,
	}));
  }, [fetchBills]);

	if (!bills) {
		return (
			<CircularProgress />
		);
	}

	if (bills.length == 0) {
		return <NotFoundContainer>
			<KayakingIcon sx={{
				fontSize: "5rem",
			}} />
			<NotFoundMsg>No Bills</NotFoundMsg>
		</NotFoundContainer>
	}

	return (
		<List>
		{bills.map(bill => (
			<BillItem bill={bill} />
		))}
		</List>
	)
}

function BillItem({
	bill,
}: {
	readonly bill: IBill,
}) {
	return (
		<ListItemButton>
			<ListItemText primary={bill.name} secondary={`${bill.lineItems.length} item(s) between ${bill.users.length} people`} />
		</ListItemButton>
	)
}