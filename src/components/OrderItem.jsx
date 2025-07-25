import { Badge, TableCell } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "helpers/formatCurrency";

const OrderItem = ({ orders }) => {
  return (
    <>
      <TableCell>#{orders.id}</TableCell>
      <TableCell>{orders.total || "Not available"}</TableCell>
      <TableCell>
        <Badge type="success">{orders.status}</Badge>{" "}
      </TableCell>
      <TableCell>{formatCurrency(orders.amount)}</TableCell>
      <TableCell>{format(parseISO(orders.date), "dd/MM/yy")}</TableCell>
    </>
  );
};

export default OrderItem;
