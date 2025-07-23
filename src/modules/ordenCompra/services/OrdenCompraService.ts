import carfaithApi from "@/core/api/carfaithApi";
import type { CreateOrdenComprasRequest, ListOrdenCompras } from "../types/OrdenComprasType";
import type { ListProveedores } from "@/modules/proveedores/types/ProveedorType";
import { formatDateLocal } from "@/core/utils/DateFormatter";

export const getOrdenesCompras = async () => {
    try {
        const response = await carfaithApi.get<ListOrdenCompras[]>('/OrdenDeCompra/ListarOrdenesCompra');
        return response.data;
    } catch (error) {
        console.error("Error Listando las Ordenes de Compras: ", error);
        throw error;
    }
}

export const getProveedores = async () => {
    try {
        const response = await carfaithApi.get<ListProveedores[]>('/Proveedores/ListarProveedoresDetalles');
        return response.data;
    } catch (error) {
        console.error("Error Listando los Proveedores: ", error);
        throw error;
    }
}

export const createOrdenCompras = async (data: CreateOrdenComprasRequest) => {
    const formattedDateCreacion = data.fechaCreacion instanceof Date
        ? formatDateLocal(data.fechaCreacion)
        : formatDateLocal(new Date());

    const formattedDateEntrega = data.fechaEstimadaEntrega instanceof Date
        ? formatDateLocal(data.fechaEstimadaEntrega)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.post<CreateOrdenComprasRequest>('/OrdenDeCompra/crearOrdenDeCompra', {
            numeroOrden: data.numeroOrden,
            idProveedor: data.idProveedor,
            archivoPdf: data.archivoPdf,
            estado: data.estado,
            fechaCreacion: formattedDateCreacion,
            fechaEstimadaEntrega: formattedDateEntrega,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear la Orden de Compra: ", error);
        throw error;
    }
}

export const updateOrdenCompras = async (data: CreateOrdenComprasRequest) => {
    const formattedDateCreacion = data.fechaCreacion instanceof Date
        ? formatDateLocal(data.fechaCreacion)
        : formatDateLocal(new Date());

    const formattedDateEntrega = data.fechaEstimadaEntrega instanceof Date
        ? formatDateLocal(data.fechaEstimadaEntrega)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.put<CreateOrdenComprasRequest>('/OrdenDeCompra/EditarOrdenCompra', {
            idOrden: data.idOrden,
            numeroOrden: data.numeroOrden,
            idProveedor: data.idProveedor,
            archivoPdf: data.archivoPdf,
            estado: data.estado,
            fechaCreacion: formattedDateCreacion,
            fechaEstimadaEntrega: formattedDateEntrega,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la Orden de Compra: ", error);
        throw error;
    }
}

export const deleteOrdenCompras = async (idOrden: number) => {
    try {
        const response = await carfaithApi.delete(`/OrdenDeCompra/EliminarOrdenCompra/${idOrden}`);
        return response.data;
    } catch (error) {
        console.error("Error eliminando la orden de Compra: ", error);
        throw error;
    }
}
