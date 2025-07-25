import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import { useUser } from "context/UserContext";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const PaymentForm = ({ next }) => {
  const { userData } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: userData?.fullname || "",
      email: userData?.email || "",
      username: userData?.username || "",
      address: userData?.address || "",
      country: userData?.country || "",
      city: userData?.city || "",
      state: userData?.state || "",
    },
  });

  return (
    <div className="w-full flex justify-center py-12 px-4 bg-gradient-to-br from-[#FDF4FF] to-[#FFF0F5]">
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white rounded-2xl shadow-xl border border-[#FFD6E0] p-8">
        {/* Heading */}
        <h1 className="text-3xl font-heading text-[#7A0BC0] font-bold text-center mb-10">
          Shipping Address
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit((data) => next(data))}
          className="space-y-6"
        >
          {[
            { name: "fullname", label: "Full Name", disabled: true },
            { name: "email", label: "Email", disabled: true },
            { name: "address", label: "Address" },
            { name: "country", label: "Country" },
            { name: "state", label: "State / Region" },
            { name: "city", label: "City" },
          ].map(({ name, label, disabled }) => (
            <div key={name} className="space-y-2">
              <Label className="text-gray-700 font-medium">{label}</Label>
              <Input
                type="text"
                disabled={disabled}
                {...register(name, { required: !disabled ? "Required" : false })}
                className="w-full border-gray-300 rounded-lg px-4 py-2 focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#E4B1F0] transition"
              />
              {errors[name] && (
                <HelperText valid={false}>{errors[name].message}</HelperText>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-between mt-10">
            <Button
              tag={Link}
              to="/cart"
              layout="outline"
              size="small"
              className="border-gray-400 text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-lg transition"
            >
              Back to Cart
            </Button>
            <Button
              type="submit"
              size="small"
              className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
            >
              Proceed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
