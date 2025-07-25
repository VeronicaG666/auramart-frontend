import { Badge, Card, CardBody } from "@windmill/react-ui";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "helpers/formatCurrency";
import Layout from "layout/Layout";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import orderService from "services/order.service";

const OrderDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [items, setItems] = useState(null);

  useEffect(() => {
    orderService.getOrder(id).then((res) => setItems(res.data));
  }, [id]);

  return (
    <Layout title="Order Details">
      <div className="max-w-5xl mx-auto my-10 bg-white rounded-xl shadow-xl p-6 md:p-10 border border-[#F1D4FF]">
        {/* Order Header */}
        <h1 className="text-4xl font-extrabold text-[#7A0BC0] mb-6">Order Details</h1>

        <div className="space-y-3 text-gray-700 mb-8">
          <p className="text-lg">
            <span className="font-semibold">Order No:</span>{" "}
            <span className="text-gray-900">#{state.order.id}</span>
          </p>
          <p>{`${state.order.total || "Not available"} items`}</p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge
              className={`px-3 py-1 text-sm rounded-full ${
                state.order.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {state.order.status}
            </Badge>
          </p>
          <p className="text-lg font-medium">
            Total Amount:{" "}
            <span className="text-[#6200EE] font-bold">
              {formatCurrency(state.order.amount)}
            </span>
          </p>
          <p>
            Placed on:{" "}
            <span className="font-medium">
              {format(parseISO(state.order.created_at), "d MMM, yyyy")}
            </span>
          </p>
        </div>

        {/* Divider */}
        <hr className="border-gray-300 mb-8" />

        {/* Order Items */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Items in Your Order</h2>
        <div className="space-y-6">
          {items?.map((item) => (
            <Card
              key={item.product_id}
              className="flex flex-col md:flex-row shadow-md rounded-xl overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <img
                className="md:w-1/3 object-cover bg-gray-50"
                loading="lazy"
                decoding="async"
                src={item.image_url || "https://placehold.co/400x300?text=Product"}
                alt={item.name}
              />

              {/* Product Details */}
              <CardBody className="p-6 flex flex-col justify-between">
                <div>
                  <h1 className="font-semibold text-xl text-[#7A0BC0] mb-2">{item.name}</h1>
                  <p className="text-lg text-gray-900 font-semibold mb-3">
                    {formatCurrency(item.price)}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <p className="mt-6 text-gray-700 font-medium text-base">
                  Quantity: {item.quantity}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;
