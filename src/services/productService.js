import { products } from "../data/products";

export function getProducts() {
  return [...products]; // copia para evitar mutaciones accidentales
}

export function getProductById(id) {
  return products.find(p => p.id === id) || null;
}