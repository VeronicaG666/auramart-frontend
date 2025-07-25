import {
  Backdrop,
  Button,
  HelperText,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@windmill/react-ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import authService from "services/auth.service";

const ForgotPasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [isSending, setIsSending] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const toggleModal = () => {
    setMsg("");
    setIsOpen(!isOpen);
  };

  const onSubmitReset = (data) => {
    setMsg("");
    setIsSending(true);
    authService
      .forgotPassword(data.email)
      .then((res) => {
        if (res.data.status === "OK") {
          setIsSending(false);
          toast.success("Reset link has been sent to your email.");
          setIsOpen(false);
        }
      })
      .catch((error) => {
        setIsSending(false);
        setMsg(error.response?.data?.message || "Failed to send reset email");
      });
  };

  return (
    <div>
      {isOpen && <Backdrop />}
      <span
        onClick={() => setIsOpen(true)}
        className="mb-1 text-sm font-semibold text-purple-600 cursor-pointer hover:underline"
      >
        Forgot password?
      </span>
      <Modal isOpen={isOpen} onClose={toggleModal}>
        <form onSubmit={handleSubmit(onSubmitReset)}>
          <ModalHeader className="text-purple-700 font-bold">
            Forgot Password
          </ModalHeader>
          <ModalBody>
            <Label>
              <span className="font-semibold text-gray-700">Email Address</span>
              <Input
                name="email"
                className="mt-1 border rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-purple-400"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email",
                  },
                })}
              />
            </Label>
            {errors.email && (
              <HelperText className="mt-2" valid={false}>
                {errors.email.message}
              </HelperText>
            )}
            {msg && (
              <HelperText className="mt-2" valid={false}>
                {msg}
              </HelperText>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={isSending}
              type="submit"
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg"
            >
              {isSending ? (
                <PulseLoader size={10} color="#fff" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export default ForgotPasswordModal;
