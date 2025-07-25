import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import Layout from "layout/Layout";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import API from "api/axios.config";
import { useUser } from "context/UserContext";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, login } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = useRef({});
  password.current = watch("password", "");

  const onSubmit = async (data) => {
    const { username, email, password, password2 } = data;
    setError("");

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const res = await API.post("/auth/signup", { username, email, password });

      const { user, token } = res.data;
      login(user, token);
      localStorage.setItem("token", token);

      toast.success("Account created successfully 🎉");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) return <Navigate to={state?.from || "/"} />;

  return (
    <Layout title="Create Account">
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#F8E8F3] to-[#FFF8FC] px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-lg border border-[#FFD6E0]"
        >
          {/* Header */}
          <h1 className="text-center text-4xl font-extrabold text-[#7A0BC0] mb-6">
            Create Account
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Join AuraMart and start shopping your favorite products today!
          </p>

          {/* Username */}
          <div className="mb-4">
            <Label className="text-gray-700 text-sm font-semibold">Username</Label>
            <Input
              type="text"
              placeholder="Enter your username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Must be at least 3 characters" },
              })}
              className="mt-1 border-gray-300 rounded-lg focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0] transition"
            />
            {errors.username && <HelperText valid={false}>{errors.username.message}</HelperText>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <Label className="text-gray-700 text-sm font-semibold">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 border-gray-300 rounded-lg focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0] transition"
            />
            {errors.email && <HelperText valid={false}>{errors.email.message}</HelperText>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <Label className="text-gray-700 text-sm font-semibold">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Must be at least 6 characters" },
              })}
              className="mt-1 border-gray-300 rounded-lg focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0] transition"
            />
            {errors.password && <HelperText valid={false}>{errors.password.message}</HelperText>}
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <Label className="text-gray-700 text-sm font-semibold">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Re-enter your password"
              {...register("password2", {
                validate: (value) => value === password.current || "Passwords do not match",
              })}
              className="mt-1 border-gray-300 rounded-lg focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0] transition"
            />
            {errors.password2 && (
              <HelperText valid={false}>{errors.password2.message}</HelperText>
            )}
          </div>

          {/* Error Message */}
          {error && <HelperText valid={false} className="mb-4">{error}</HelperText>}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold py-3 rounded-lg transition"
          >
            {isLoading ? <PulseLoader color="#fff" size={10} /> : "Create Account"}
          </Button>

          {/* Login Redirect */}
          <p className="text-sm mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#7A0BC0] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Register;
