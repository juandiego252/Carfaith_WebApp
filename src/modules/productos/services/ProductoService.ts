import carfaithApi from "@/core/api/carfaithApi"
import type { CreateProductoRequest, EditProductoRequest, LineaDeProducto, ProductoList } from "../types/ProductoType";

export const getProductos = async () => {
    try {
        const response = await carfaithApi.get<ProductoList[]>('/Producto/ListarProductos');
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export const getLineasProductos = async () => {
    try {
        const response = await carfaithApi.get<LineaDeProducto[]>('/LineaDeProducto/listarProductos');
        return response.data;
    } catch (error) {
        console.error("Error fetching product lines:", error);
        throw error;
    }
}

export const createProducto = async (data: CreateProductoRequest) => {
    try {
        const response = await carfaithApi.post<CreateProductoRequest>('/Producto/CrearProductos', {
            codigoProducto: data.codigoProducto,
            nombre: data.nombre,
            lineaDeProducto: data.lineaDeProducto
        });
        return response.data;

    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }

}

export const editProducto = async (data: EditProductoRequest) => {
    try {

        console.log({
            idProducto: data.idProducto,
            codigoProducto: data.codigoProducto,
            nombre: data.nombre,
            lineaDeProducto: data.lineaDeProducto
        })

        const response = await carfaithApi.put<EditProductoRequest>('/Producto/EditarProducto', {
            idProducto: data.idProducto,
            codigoProducto: data.codigoProducto,
            nombre: data.nombre,
            lineaDeProducto: data.lineaDeProducto
        })
        return response.data;
    } catch (error) {
        console.error("Error editing product:", error);
        throw error;
    }
}

export const deleteProducto = async (id: number) => {
    try {
        const response = await carfaithApi.delete(`/Producto/EliminarProducto/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
}