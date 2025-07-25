import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import Layout from "layout/Layout";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import authService from "services/auth.service";

const ResetPassword = () => {
  const [msg, setMsg] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  
  useEffect(() => {
    authService
      .checkToken(token, email)
      .then(({ data }) => setMsg(data))
      .catch(() => setMsg({ showForm: false, message: "Invalid or expired reset link." }));
  }, [token, email]);

  
  const handlePasswordReset = (data) => {
    setIsResetting(true);
    authService
      .resetPassword(token, email, data.password, data.password2)
      .then(({ data }) => {
        if (data.status === "error") {
          setResetMsg(data);
          setIsResetting(false);
          return;
        }
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch(() => setIsResetting(false));
  };

  return (
    <Layout title="Reset Password">
      {msg.showForm ? (
        <div className="flex justify-center items-center min-h-[70vh] bg-gradient-to-br from-[#FDF4FF] to-[#FFF8FC] px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-[#FFD6E0] p-8 w-full max-w-lg">
            {/* Header */}
            <h1 className="text-3xl font-extrabold text-[#7A0BC0] text-center mb-4">
              Reset Your Password
            </h1>
            <p className="text-center text-gray-500 mb-8 text-sm">
              Enter your new password below and confirm to continue.
            </p>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit(handlePasswordReset)}>
              {/* Password */}
              <div>
                <Label className="text-gray-700 font-semibold">New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  {...register("password", {
                    required: "Password cannot be empty",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  className="mt-2 w-full border-gray-300 rounded-lg focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0] transition"
                />
                {errors.password && <HelperText valid={false}>{errors.password.message}</HelperText>}
                {resetMsg?.message && <HelperText valid={false}>{resetMsg.message}</HelperText>}
              </div>

              {/* Confirm Password */}
              <div>
                <Label className="text-gray-700 font-semibold">Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Re-enter new password"
                  {...register("password2", {
                    validate: (value) => value === password.current || "Passwords do not match",
                  })}
                  className="mt-2 w-full border-gray-300 rounded-lg focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0] transition"
                />
                {errors.password2 && <HelperText valid={false}>{errors.password2.message}</HelperText>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isResetting}
                className="w-full bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold py-3 rounded-lg shadow-md"
              >
                {isResetting ? <PulseLoader size={10} color="#fff" /> : "Reset Password"}
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600 font-medium py-16">
          {msg.message || "Checking your reset link..."}
        </div>
      )}
    </Layout>
  );
};

export default ResetPassword;
