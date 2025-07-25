import { Link } from "react-router-dom";
import { Search } from "react-feather";

function NotFound() {
  return (
    <div className="grid h-screen place-content-center bg-gradient-to-br from-[#FFF0F5] via-[#FFD6E0] to-[#F6F6F6] px-4 text-center">
      {/* 404 Text */}
      <h1 className="text-9xl font-extrabold text-[#E4B1F0] drop-shadow-lg animate-bounce">
        404
      </h1>

      {/* Heading */}
      <p className="text-3xl font-bold tracking-tight text-[#7A0BC0] sm:text-4xl mt-4">
        Oops! Page Not Found
      </p>

      {/* Subtext */}
      <p className="mt-3 text-gray-600 text-lg">
        We couldn’t find the page you’re looking for.
      </p>

      {/* Optional Search Bar */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full max-w-xs">
          <input
            type="text"
            placeholder="Search for products..."
            className="px-4 py-2 w-full focus:outline-none"
          />
          <button className="px-4 bg-[#7A0BC0] text-white">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Back Home Button */}
      <Link
        to="/"
        aria-label="Go back to homepage"
        className="mt-6 inline-block rounded-lg bg-[#7A0BC0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5A189A] transition shadow-md"
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;
