import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import { useUser } from "context/UserContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PulseLoader from "react-spinners/PulseLoader";

const AccountForm = ({ setShowSettings, userData }) => {
  const { updateUserData } = useUser();
  const [validationError, setValidationError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const onSubmit = async (data) => {
    setValidationError(null);
    setIsSaving(true);
    try {
      await updateUserData(data);
      setShowSettings(false);
    } catch (error) {
      setValidationError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="flex justify-center py-12 px-4">
      <div className="w-full md:w-2/3 lg:w-1/2 bg-white shadow-xl rounded-xl p-8 border border-[#FFD6E0]">
        {/* Header */}
        <h3 className="text-3xl font-bold text-[#7A0BC0] mb-8 border-b pb-3">
          Account Settings
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {[
            { name: "fullname", label: "Full Name" },
            { name: "username", label: "Username" },
            {
              name: "email",
              label: "Email Address",
              readOnly: true, 
            },
            { name: "address", label: "Address" },
            { name: "city", label: "City" },
            { name: "state", label: "State" },
            { name: "country", label: "Country" },
          ].map(({ name, label, readOnly }) => (
            <div key={name}>
              <Label className="text-gray-700 font-semibold text-sm">{label}</Label>
              <Input
                {...register(name, {
                  required: name !== "email" ? `${label} is required` : false,
                })}
                readOnly={readOnly}
                className="mt-2 block w-full border-gray-300 rounded-lg shadow-sm focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0]"
              />
              {errors[name] && (
                <HelperText valid={false}>{errors[name].message}</HelperText>
              )}
              {validationError?.[name] && (
                <HelperText valid={false}>{validationError[name]}</HelperText>
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <Button
              disabled={isSaving}
              type="submit"
              className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              {isSaving ? <PulseLoader color="#fff" size={8} /> : "Save Changes"}
            </Button>
            <Button
              disabled={isSaving}
              onClick={() => setShowSettings(false)}
              layout="outline"
              className="border-gray-400 text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AccountForm;
