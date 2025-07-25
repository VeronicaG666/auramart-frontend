import { Button, HelperText, Input, Label } from "@windmill/react-ui";
import Layout from "layout/Layout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import API from "api/axios.config";
import { useUser } from "context/UserContext";

const Login = () => {
  const { login, isLoggedIn } = useUser();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  
  const onSubmit = async ({ email, password }) => {
    setError("");
    try {
      setIsLoading(true);
      const res = await API.post("/auth/login", { email, password });

      const { user, token } = res.data;
      login(user, token);
      localStorage.setItem("token", token);

      toast.success("Login successful 🔓");
      navigate(state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) return <Navigate to={state?.from || "/"} />;

  return (
    <Layout title="Login">
      <div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-[#F8E8F3] to-[#FFF8FC] px-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg px-8 py-10 w-full max-w-md border border-[#FFD6E0]"
        >
          {/* Title */}
          <h1 className="text-center text-4xl font-extrabold text-[#7A0BC0] mb-8">
            Welcome Back
          </h1>

          {/* Email */}
          <div>
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
          <div className="mt-4">
            <Label className="text-gray-700 text-sm font-semibold">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 border-gray-300 rounded-lg focus:border-[#7A0BC0] focus:ring-2 focus:ring-[#FFD6E0] transition"
            />
            {errors.password && (
              <HelperText valid={false}>{errors.password.message}</HelperText>
            )}
          </div>

          {/* Error */}
          {error && <HelperText valid={false} className="mt-2">{error}</HelperText>}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-6 bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold py-2 rounded-lg w-full"
          >
            {isLoading ? <PulseLoader color="#fff" size={10} /> : "Login"}
          </Button>

          {/* Signup Link */}
          <p className="text-sm mt-6 text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-bold text-[#7A0BC0] hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
