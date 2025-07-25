import Spinner from "components/Spinner";
import Layout from "layout/Layout";
import {
  Account,
  Cart,
  Checkout,
  Confirmation,
  Login,
  NotFound,
  OrderDetails,
  Orders,
  ProductDetails,
  ProductList,
  Register, 
} from "pages";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "routes/protected.route";

function App() {
  return (
    <Suspense
      fallback={
        <Layout>
          <Spinner size={100} />
        </Layout>
      }
    >
      <Toaster position="top-right" />
      <Routes>
        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
          path="/profile"
        />
        <Route
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
          path="/cart/checkout"
        />
        <Route
          element={
            <ProtectedRoute>
              <Confirmation />
            </ProtectedRoute>
          }
          path="/cart/success"
        />
        <Route
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
          path="/orders"
        />
        <Route
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
          path="/orders/:id/"
        />

        {/* Public routes */}
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route index element={<ProductList />} />
        <Route path="/products/:slug/" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
