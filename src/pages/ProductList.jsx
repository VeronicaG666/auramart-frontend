import { Pagination } from "@windmill/react-ui";
import Product from "components/Product";
import Spinner from "components/Spinner";
import { useProduct } from "context/ProductContext";
import Layout from "layout/Layout";
import { useState } from "react";

const ProductList = () => {
  const {
    products,
    page,
    fetchProducts,
    totalPages,
    totalResults,
    categories,
    isLoading,
  } = useProduct();

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "",
  });

  /** Handle page change */
  const handleChangePage = (newPage) => {
    fetchProducts({ ...filters, page: newPage });
    window.scrollTo({ behavior: "smooth", top: 0 });
  };

  /** Update filter state */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  /** Apply filters */
  const applyFilters = () => {
    fetchProducts({ ...filters, page: 1 });
  };

  /** Loading state */
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center py-20">
          <Spinner size={100} loading />
        </div>
      </Layout>
    );
  }

  console.log("Products:", products);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FFE2E2] to-[#FFF0F5] rounded-2xl shadow-lg px-6 py-12 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-[#7743DB] mb-4">
          Welcome to AuraMart
        </h1>
        <p className="text-gray-700 text-lg md:text-xl mb-6 max-w-2xl mx-auto leading-relaxed">
          Discover premium products with amazing deals. Shop smart, shop stylish.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          className="bg-[#7743DB] hover:bg-[#5A189A] text-white px-8 py-3 rounded-lg font-semibold shadow-md transition duration-300"
        >
          Shop Now
        </button>
      </section>

      <div className="container mx-auto space-y-10 px-4 pb-24 lg:px-10">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg p-5 rounded-xl gap-4 border border-gray-200">
          {/* Search */}
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search products..."
            className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-[#7743DB] outline-none transition duration-200"
          />

          {/* Category Filter */}
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#7743DB] outline-none transition"
          >
            <option value="">All Categories</option>
            {categories.length > 0 &&
              categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          {/* Sort Filter */}
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-[#7743DB] outline-none transition"
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          {/* Apply Button */}
          <button
            onClick={applyFilters}
            className="bg-[#7A0BC0] hover:bg-[#5A189A] text-white px-6 py-2 rounded-lg font-semibold shadow-md transition"
          >
            Apply
          </button>
        </div>

        {/* Total Results */}
        <p className="text-gray-600 text-sm text-center md:text-left">
          Showing page <span className="font-semibold">{page}</span> of{" "}
          <span className="font-semibold">{totalPages}</span> ({totalResults} results)
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products && products.length > 0 ? (
            products.map((prod) => <Product key={prod.id} product={prod} />)
          ) : (
            <p className="text-center col-span-full my-6 text-gray-500">
              No products found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination
              totalResults={totalResults}
              resultsPerPage={12}
              onChange={handleChangePage}
              label="Page navigation"
              currentPage={page}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductList;
