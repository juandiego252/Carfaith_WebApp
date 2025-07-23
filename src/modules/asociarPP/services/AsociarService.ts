import carfaithApi from "@/core/api/carfaithApi";
import type { MassiveAsociationRequest, ProductoProveedorDetalles } from "../types/ProductoProveedorTypes";

export const asociateProductoProveedor = async (idProducto: number, idProveedor: number) => {
    console.log({
        idProducto,
        idProveedor
    })
    try {
        const response = await carfaithApi.post('/ProductoProveedor/AsociarProductoProveedor', {
            idProducto: idProducto,
            idProveedor: idProveedor
        });
        return response.data;
    } catch (error) {
        console.error("Error associating product with provider:", error);
        throw error;
    }

}

export const getDetalleProductoProveedor = async () => {
    try {
        const response = await carfaithApi.get<ProductoProveedorDetalles[]>('ProductoProveedor/ListarDetalleProductoProveedor');
        return response.data;
    } catch (error) {
        console.error("Error fetching product-provider details:", error);
        throw error;
    }
}

export const massiveAssociation = async (data: MassiveAsociationRequest) => {
    try {
        const response = await carfaithApi.post<MassiveAsociationRequest[]>('ProductoProveedor/AsociarMasivaProductoProveedores', {
            idProducto: data.idProducto,
            idsProveedores: data.idsProveedores
        });
        return response.data;
    } catch (error) {
        console.error("Error in massive association:", error);
        throw error;
    }
}

export const deleteProductoProveedor = async (idProductoProveedor: number) => {
    try {
        const response = await carfaithApi.delete(`ProductoProveedor/EliminarProductoProveedor/${idProductoProveedor}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting product-provider association:", error);
        throw error;
    }
}

export const editProductoProveedor = async (idProductoProveedor: number, idProducto: number, idProveedor: number) => {
    console.log({
        idProductoProveedor,
        idProducto,
        idProveedor
    })
    try {
        const response = await carfaithApi.put('ProductoProveedor/ActualizarProductoProveedor', {
            idProductoProveedor: idProductoProveedor,
            idProducto: idProducto,
            idProveedor: idProveedor
        });
        return response.data;
    } catch (error) {
        console.error("Error editing product-provider association:", error);
        throw error;
    }
}