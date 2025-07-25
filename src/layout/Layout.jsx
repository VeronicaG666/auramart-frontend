import Nav from "components/Nav";
import Spinner from "components/Spinner";
import { Helmet } from "react-helmet-async";

const Layout = ({ children, title, loading }) => {
  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title ?? "Home"} | AuraMart</title>
        <meta
          name="description"
          content="AuraMart - Your modern shopping experience built with React, Node, Express, and PostgreSQL"
        />
        <link rel="canonical" href="https://auramart.netlify.app/" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AuraMart" />
        <meta
          property="og:description"
          content="Shop the latest products at AuraMart. Fast, simple, and secure."
        />
        <meta property="og:image" content="android-chrome-512x512.png" />
        <meta property="og:site_name" content="AuraMart" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AuraMart" />
        <meta name="twitter:image" content="android-chrome-512x512.png" />
        <style type="text/css">{`
          html, body {
            height: 100%;
            background-color: #ECECEC; /* Slightly greyer than before */
            font-family: 'Poppins', 'Inter', sans-serif;
            margin: 0;
            padding: 0;
          }
        `}</style>
      </Helmet>

      {/* Full Layout Container */}
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800">
        {/* Navigation */}
        <Nav />

        {/* Main Content */}
        <div className="flex-grow w-full max-w-screen-2xl mx-auto px-6 sm:px-10 lg:px-20 xl:px-32 mt-20">
          {loading ? (
            <div className="flex justify-center items-center h-full py-20">
              <Spinner size={100} loading />
            </div>
          ) : (
            <main>{children}</main>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 bg-gradient-to-r from-[#FFD6E0] to-[#E4B1F0] text-center shadow-inner">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-[#7A0BC0]">AuraMart</span> —{" "}
            <span className="text-[#FF597B]">Built with ❤️ for modern shopping</span>
          </p>
        </footer>
      </div>
    </>
  );
};

export default Layout;
