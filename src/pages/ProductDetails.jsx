import { Button } from "@windmill/react-ui";
import { useCart } from "context/CartContext";
import { formatCurrency } from "helpers/formatCurrency";
import Layout from "layout/Layout";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReactStars from "react-rating-stars-component";
import { useNavigate, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import productService from "services/product.service";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  /** Add to Cart */
  const addToCart = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addItem(product, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Error adding to cart");
    } finally {
      setIsLoading(false);
    }
  };

  /** Fetch Product Data */
  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const { data: product } = await productService.getProduct(slug);
        setProduct(product);
      } catch {
        navigate("/404", { replace: true });
      } finally {
        setIsFetching(false);
      }
    }
    fetchData();
  }, [slug, navigate]);

  return (
    <Layout loading={isFetching} title={product?.name}>
      <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-[#FDF4FF] to-[#FFF0F5]">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Image */}
            <div className="flex justify-center items-center">
              <img
                src={
                  product?.image_url ||
                  "https://placehold.co/500x500?text=No+Image+Available"
                }
                alt={product?.name}
                className="w-full max-h-[450px] object-contain rounded-xl shadow-md"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between space-y-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-semibold text-[#7A0BC0] mb-4">
                  {product?.name}
                </h1>
                <div className="flex items-center mb-4">
                  <ReactStars
                    count={5}
                    size={28}
                    edit={false}
                    value={+product?.avg_rating}
                    activeColor="#FFD700"
                  />
                  <span className="ml-3 text-gray-600 text-sm">
                    {+product?.count > 0
                      ? `${+product.count} Ratings`
                      : "No ratings yet"}
                  </span>
                </div>
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  {product?.description}
                </p>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 gap-4">
                <span className="text-3xl font-extrabold text-[#6200EE]">
                  {formatCurrency(product?.price)}
                </span>
                <Button
                  className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-md"
                  onClick={addToCart}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetails;
