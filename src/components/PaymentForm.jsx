import { CardElement, Elements, ElementsConsumer } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button, HelperText } from "@windmill/react-ui";
import API from "api/axios.config";
import { useCart } from "context/CartContext";
import { formatCurrency } from "helpers/formatCurrency";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import OrderService from "services/order.service";
import OrderSummary from "./OrderSummary";
import PaystackBtn from "./PaystackBtn";

const PaymentForm = ({ previousStep, addressData }) => {
  const { cartSubtotal, cartTotal, cartData, setCartData } = useCart();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);
  const navigate = useNavigate();

  const handleSubmit = async (e, elements, stripe) => {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements) return;

    const { fullname, email, address, city, state } = addressData;

    try {
      setIsProcessing(true);

      const { data } = await API.post("/payment", {
        amount: (cartSubtotal * 100).toFixed(),
        email,
      });

      const card = elements.getElement(CardElement);
      const result = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: fullname,
          email,
          address: { city, line1: address, state, country: "NG" },
        },
      });

      if (result.error) {
        setError(result.error);
        setIsProcessing(false);
        return;
      }

      await stripe.confirmCardPayment(data.client_secret, {
        payment_method: result.paymentMethod.id,
      });

      await OrderService.createOrder(cartSubtotal, cartTotal, data.id, "STRIPE");
      setCartData({ ...cartData, items: [] });
      navigate("/cart/success", { state: { fromPaymentPage: true } });
    } catch (err) {
      console.error("Stripe Payment Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#FFD6E0] p-8 mt-8">
      {/* Heading */}
      <h1 className="text-3xl font-heading text-[#7A0BC0] font-bold text-center mb-8">
        Complete Your Payment
      </h1>

      {/* Order Summary */}
      <OrderSummary />

      {/* Stripe Section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Pay with Stripe</h2>
        <Elements stripe={stripePromise}>
          <ElementsConsumer>
            {({ stripe, elements }) => (
              <form
                onSubmit={(e) => handleSubmit(e, elements, stripe)}
                className="space-y-6"
              >
                <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-4 shadow-sm">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          fontFamily: "Inter, sans-serif",
                          color: "#2C2C2C",
                          "::placeholder": { color: "#A0AEC0" },
                        },
                        invalid: { color: "#E53E3E" },
                      },
                    }}
                  />
                </div>
                {error && (
                  <HelperText valid={false} className="text-red-500">
                    {error.message}
                  </HelperText>
                )}

                <div className="flex justify-between items-center pt-4">
                  <Button
                    onClick={previousStep}
                    layout="outline"
                    size="small"
                    className="border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-2 rounded-lg transition"
                  >
                    Back
                  </Button>
                  <Button
                    disabled={!stripe || isProcessing}
                    type="submit"
                    size="small"
                    className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white px-6 py-2 rounded-lg shadow-md transition"
                  >
                    {isProcessing ? (
                      <PulseLoader size={10} color={"#fff"} />
                    ) : (
                      `Pay ${formatCurrency(cartSubtotal)}`
                    )}
                  </Button>
                </div>
              </form>
            )}
          </ElementsConsumer>
        </Elements>
      </div>

      {/* Divider */}
      <div className="flex items-center my-10">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-500 font-medium">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Paystack */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-3 text-gray-800">Pay with Paystack</h2>
        <PaystackBtn isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
      </div>
    </div>
  );
};

export default PaymentForm;
