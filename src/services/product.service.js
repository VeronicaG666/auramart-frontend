import API from "api/axios.config";

class ProductService {
  getProducts({ page = 1, search = "", category = "", sort = "" }) {
    const params = new URLSearchParams();
    params.append("page", page);
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (sort) params.append("sort", sort);

    return API.get(`/products?${params.toString()}`);
  }

  getProduct(id) {
    return API.get(`/products/${id}`);
  }

  getProductByName(name) {
    return API.get(`/products/${name}`);
  }

  getCategories() {
    return API.get(`/products/categories/list`);
  }
}

export default new ProductService();
