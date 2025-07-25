import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
  TableRow,
} from "@windmill/react-ui";
import OrderItem from "components/OrderItem";
import { useOrders } from "context/OrderContext";
import Layout from "layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderService from "services/order.service";

const Orders = () => {
  const { orders, setOrders } = useOrders();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handlePage = (num) => setCurrentPage(num);

  const goToDetails = (order) => {
    navigate(`/orders/${order.order_id}`, { state: { order } });
  };

  useEffect(() => {
    orderService.getAllOrders(currentPage).then((res) => setOrders(res.data));
  }, [currentPage, setOrders]);

  if (orders?.length === 0) {
    return (
      <Layout loading={orders === null}>
        <div className="flex flex-col justify-center items-center min-h-[70vh] bg-gradient-to-br from-[#FDF4FF] to-[#FFF8FC] px-4">
          <h1 className="text-4xl font-extrabold text-[#7A0BC0] mb-3">Your Orders</h1>
          <p className="text-gray-600 text-center max-w-md">
            You haven’t placed any orders yet. Start shopping and track your orders here.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Orders" loading={orders === null}>
      <div className="max-w-6xl mx-auto py-10 px-4">
        {/* Page Title */}
        <h1 className="text-center text-4xl md:text-5xl font-bold text-[#7A0BC0] mb-8">
          Your Orders
        </h1>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-xl border border-[#F1D4FF] overflow-hidden">
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F8F1FF] text-gray-700">
                  <TableCell className="font-semibold">Order ID</TableCell>
                  <TableCell className="font-semibold">Items</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Amount</TableCell>
                  <TableCell className="font-semibold">Date</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.items.map((order) => (
                  <TableRow
                    key={order.order_id}
                    onClick={() => goToDetails(order)}
                    className="cursor-pointer hover:bg-[#FDF4FF] transition duration-150"
                  >
                    <OrderItem order={order} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TableFooter>
            <div className="flex justify-center py-6 bg-[#FFF8FC] border-t border-[#F1D4FF]">
              <Pagination
                totalResults={orders?.total}
                resultsPerPage={5}
                onChange={handlePage}
                label="Table navigation"
              />
            </div>
          </TableFooter>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
