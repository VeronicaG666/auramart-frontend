import { createContext, useContext, useEffect, useState } from "react";
import productService from "services/product.service";

const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "",
  });
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  
  const fetchProducts = async ({
    search = "",
    category = "",
    sort = "",
    page: pageNumber = 1,
  }) => {
    setIsLoading(true);
    try {
      const { data } = await productService.getProducts({
        page: pageNumber,
        search,
        category,
        sort,
      });

      setProducts(data.products || []);
      setFilters({ search, category, sort });
      setPage(pageNumber);
      setTotalPages(data.totalPages || 1);
      setTotalResults(data.totalResults || 0);
    } catch (error) {
      console.error("Error fetching products:", error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchCategories = async () => {
    try {
      const { data } = await productService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  
  useEffect(() => {
    fetchProducts({ page });
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        page,
        totalPages,
        totalResults,
        fetchProducts,
        filters,
        categories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
};

export { ProductProvider, useProduct };
