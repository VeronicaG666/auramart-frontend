import AddressForm from "components/AddressForm";
import PaymentForm from "components/PaymentForm";
import { useCart } from "context/CartContext";
import Layout from "layout/Layout";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addressData, setAddressData] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cartData } = useCart();

  /** Redirect if cart is empty */
  useEffect(() => {
    if (!state?.fromCartPage || cartData?.items?.length === 0) {
      navigate("/cart");
    }
  }, [cartData, navigate, state]);

  /** Navigation Handlers */
  const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
  const previousStep = () => setActiveStep((prevStep) => prevStep - 1);
  const next = (data) => {
    setAddressData(data);
    nextStep();
  };

  return (
    <Layout title="Checkout">
      <section className="flex flex-col items-center py-12 px-4">
        {/* Progress Indicator */}
        <div className="flex justify-center items-center mb-12">
          {/* Step 1 */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all ${
                activeStep === 0 ? "bg-[#7A0BC0]" : "bg-[#03DAC6] text-gray-900"
              }`}
            >
              1
            </div>
            <span className="mx-2 text-gray-700 font-heading font-semibold text-lg">
              Address
            </span>
          </div>

          <div className="w-14 border-t-4 border-dashed border-[#E4B1F0] mx-3"></div>

          {/* Step 2 */}
          <div className="flex items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-all ${
                activeStep === 1 ? "bg-[#7A0BC0]" : "bg-gray-300"
              }`}
            >
              2
            </div>
            <span className="mx-2 text-gray-700 font-heading font-semibold text-lg">
              Payment
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl font-heading font-bold text-center text-[#7A0BC0] mb-8">
          {activeStep === 0 ? "Shipping Details" : "Complete Your Payment"}
        </h2>

        {/* Step Content */}
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
          {activeStep === 0 ? (
            <AddressForm next={next} />
          ) : (
            <PaymentForm
              nextStep={nextStep}
              previousStep={previousStep}
              addressData={addressData}
            />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
