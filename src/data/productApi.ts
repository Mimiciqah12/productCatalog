import { Product } from "../types/Product";

const BASE_URL = "https://dummyjson.com";

export type ProductResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export async function getProducts(
  limit: number = 20,
  skip: number = 0,
): Promise<ProductResponse> {
  const response = await fetch(
    `${BASE_URL}/products?limit=${limit}&skip=${skip}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load products");
  }

  const data: ProductResponse = await response.json();

  return data;
}

export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to load product");
  }

  const data: Product = await response.json();

  return data;
}

export async function searchProducts(
  query: string,
  limit: number = 20,
  skip: number = 0,
): Promise<ProductResponse> {
  const response = await fetch(
    `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`,
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const data: ProductResponse = await response.json();

  return data;
}
