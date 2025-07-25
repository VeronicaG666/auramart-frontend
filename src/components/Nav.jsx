import { Badge, Button, Dropdown, DropdownItem, Transition } from "@windmill/react-ui";
import { useCart } from "context/CartContext";
import { useUser } from "context/UserContext";
import { useState } from "react";
import { LogOut, ShoppingCart, User } from "react-feather";
import { Link } from "react-router-dom";

const Nav = () => {
  const { cartTotal } = useCart();
  const { isLoggedIn, userData, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto flex justify-between items-center px-6 sm:px-10 lg:px-20 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-extrabold font-heading text-[#7743DB] tracking-tight"
        >
          AuraMart
        </Link>

        {/* Navigation */}
        <ul className="flex items-center space-x-6">
          {/* Cart */}
          <li>
            <Link to="/cart">
              <Button
                layout="link"
                className="flex items-center font-semibold text-[#7743DB] hover:text-[#5A189A] transition"
              >
                <ShoppingCart className="mr-1" />
                <span className="hidden md:inline">Cart</span>
                {cartTotal > 0 && (
                  <Badge className="ml-2 bg-[#FF597B] text-white rounded-full">
                    {cartTotal}
                  </Badge>
                )}
              </Button>
            </Link>
          </li>

          {/* Auth Buttons */}
          {!isLoggedIn ? (
            <li>
              <Link to="/login">
                <Button className="bg-[#7743DB] hover:bg-[#5A189A] text-white px-5 py-2 rounded-lg shadow-sm transition">
                  Login
                </Button>
              </Link>
            </li>
          ) : (
            <li className="relative">
              <Button
                layout="link"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                className="font-semibold text-[#7743DB] hover:text-[#5A189A]"
              >
                <User className="mr-1" />
                <span className="hidden md:inline">Account</span>
              </Button>

              {/* Dropdown */}
              <Transition
                show={isDropdownOpen}
                enter="transition ease-out duration-150 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-100 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dropdown
                  align="right"
                  isOpen={isDropdownOpen}
                  className="z-20 w-56 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  {/* User Info */}
                  <DropdownItem className="cursor-default text-gray-700 border-b pb-2">
                    <p className="font-semibold">{userData?.fullname}</p>
                    <p className="text-sm text-gray-500">@{userData?.username}</p>
                  </DropdownItem>

                  {/* Profile & Orders */}
                  <DropdownItem>
                    <Link
                      className="block w-full text-[#7743DB] hover:underline"
                      to="/profile"
                    >
                      Profile
                    </Link>
                  </DropdownItem>
                  <DropdownItem>
                    <Link
                      className="block w-full text-[#7743DB] hover:underline"
                      to="/orders"
                    >
                      Orders
                    </Link>
                  </DropdownItem>

                  {/* Logout */}
                  <DropdownItem
                    tag="div"
                    className="border-t cursor-pointer text-red-500 font-semibold hover:bg-red-50"
                    onClick={logout}
                  >
                    <div className="flex items-center gap-2 px-4 py-2">
                      <LogOut size={16} />
                      Logout
                    </div>
                  </DropdownItem>
                </Dropdown>
              </Transition>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
