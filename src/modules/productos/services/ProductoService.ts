import carfaithApi from "@/core/api/carfaithApi"
import type { Producto } from "../types/ProductoType";

export const getProductos = async () => {
    try {
        const response = await carfaithApi.get<Producto[]>('/Producto/ListarProductos');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}