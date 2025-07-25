import { Button } from "@windmill/react-ui";
import { useUser } from "context/UserContext";
import Layout from "layout/Layout";
import { useEffect } from "react";
import { CheckCircle } from "react-feather";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Confirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { userData } = useUser();

  useEffect(() => {
    if (!state?.fromPaymentPage) {
      return navigate("/");
    }
  }, [state, navigate]);

  return (
    <Layout title="Order Confirmation">
      <section className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-[#F8E8F3] to-[#FFF8FC] rounded-xl shadow-lg mx-4 md:mx-16 p-10">
        {/* Icon */}
        <div className="bg-white p-6 rounded-full shadow-md mb-6">
          <CheckCircle color="#7A0BC0" size={100} />
        </div>

        {/* Confirmation Text */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[#7A0BC0]">Order Confirmed!</h1>
          <p className="text-gray-700 text-lg">
            Thank you for your purchase, <span className="font-semibold">{userData?.fullname}</span>!
          </p>
          <p className="text-gray-500">Your items will be on their way soon.</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Button
            tag={Link}
            to="/products"
            layout="outline"
            className="border-[#7A0BC0] text-[#7A0BC0] hover:bg-[#F8E8F3]"
          >
            Continue Shopping
          </Button>
          <Button
            tag={Link}
            to="/orders"
            className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold"
          >
            Manage Order
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Confirmation;
