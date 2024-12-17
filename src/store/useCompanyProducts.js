//src/store/useCompanyProducts.js
import { create } from 'zustand';

const useCompanyProducts = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) => set(state => ({
    products: [...state.products, product]
  })),
  updateProduct: (updatedProduct) => set(state => ({
    products: state.products.map(product => 
      product._id === updatedProduct._id ? updatedProduct : product
    )
  })),
  deleteProduct: (productId) => set(state => ({
    products: state.products.filter(product => product._id !== productId)
  })),
  resetProducts: () => set({ products: [] }),
}));

export default useCompanyProducts;