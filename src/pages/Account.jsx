import { Button } from "@windmill/react-ui";
import AccountForm from "components/AccountForm";
import { useUser } from "context/UserContext";
import Layout from "layout/Layout";
import { useState } from "react";
import { Edit2 } from "react-feather";
import toast from "react-hot-toast";
import PulseLoader from "react-spinners/PulseLoader";
import authService from "services/auth.service";

const Account = () => {
  const { userData } = useUser();
  const [showSettings, setShowSettings] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const resetPassword = () => {
    setIsSending(true);
    authService
      .forgotPassword(userData.email)
      .then((data) => {
        if (data.data.status === "OK") {
          setIsSending(false);
          toast.success("Email has been sent successfully.");
        }
      })
      .catch(() => {
        setIsSending(false);
        toast.error("An error occurred. Please try again.");
      });
  };

  return (
    <Layout title="Profile" loading={userData === null}>
      {showSettings ? (
        <AccountForm userData={userData} setShowSettings={setShowSettings} />
      ) : (
        <div className="flex justify-center py-10 px-4">
          <div className="w-full md:w-3/4 lg:w-1/2 bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFD6E0] to-[#E4B1F0] px-6 py-6">
              <h3 className="text-2xl font-bold text-[#7A0BC0]">My Profile</h3>
              <p className="text-sm text-gray-700">
                Manage your account details and preferences
              </p>
            </div>

            {/* Info Section */}
            <div className="divide-y divide-gray-200">
              <dl>
                {/* Full Name */}
                <div className="px-6 py-4 flex justify-between">
                  <dt className="font-semibold text-gray-500">Full Name</dt>
                  <dd className="text-gray-900">{userData?.fullname}</dd>
                </div>

                {/* Username */}
                <div className="px-6 py-4 flex justify-between bg-[#FAFAFA]">
                  <dt className="font-semibold text-gray-500">Username</dt>
                  <dd className="text-gray-900">{userData?.username}</dd>
                </div>

                {/* Email */}
                <div className="px-6 py-4 flex justify-between">
                  <dt className="font-semibold text-gray-500">Email</dt>
                  <dd className="text-gray-900">{userData?.email}</dd>
                </div>

                {/* Password Reset */}
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-[#FAFAFA]">
                  <dt className="font-semibold text-gray-500 mb-2 sm:mb-0">Password</dt>
                  <Button
                    disabled={isSending}
                    onClick={resetPassword}
                    className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-medium px-4 py-2 rounded-lg"
                  >
                    {isSending ? (
                      <PulseLoader color="#FFF" size={10} />
                    ) : (
                      "Reset via Email"
                    )}
                  </Button>
                </div>

                {/* Address */}
                <div className="px-6 py-4 flex justify-between">
                  <dt className="font-semibold text-gray-500">Address</dt>
                  <dd className="text-gray-900">{userData?.address || "Not Provided"}</dd>
                </div>

                {/* City */}
                <div className="px-6 py-4 flex justify-between bg-[#FAFAFA]">
                  <dt className="font-semibold text-gray-500">City</dt>
                  <dd className="text-gray-900">{userData?.city || "Not Provided"}</dd>
                </div>

                {/* State */}
                <div className="px-6 py-4 flex justify-between">
                  <dt className="font-semibold text-gray-500">State</dt>
                  <dd className="text-gray-900">{userData?.state || "Not Provided"}</dd>
                </div>

                {/* Country */}
                <div className="px-6 py-4 flex justify-between bg-[#FAFAFA]">
                  <dt className="font-semibold text-gray-500">Country</dt>
                  <dd className="text-gray-900">{userData?.country || "Not Provided"}</dd>
                </div>

                {/* Edit Button */}
                <div className="px-6 py-5 text-right">
                  <Button
                    iconRight={Edit2}
                    onClick={() => setShowSettings(true)}
                    className="bg-[#03DAC6] hover:bg-[#018786] text-gray-900 font-semibold px-4 py-2 rounded-lg shadow"
                  >
                    Edit Profile
                  </Button>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Account;
