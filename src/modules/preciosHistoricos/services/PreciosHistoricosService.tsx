import carfaithApi from "@/core/api/carfaithApi";
import { formatDateLocal } from "@/core/utils/DateFormatter";
import { type CreatePreciosHistoricosRequest, type ListPreciosHistoricos, type ListProductoProveedor } from "../types/PreciosHistoricosTypes";

export const getPreciosHistoricos = async () => {
    try {
        const response = await carfaithApi.get<ListPreciosHistoricos[]>('/PreciosHistoricos/ListarPreciosHistoricos');
        return response.data;
    } catch (error) {
        console.error("Error Listando los Precios Históricos: ", error);
        throw error;
    }
}

export const getProductoProveedor = async () => {
    try {
        const response = await carfaithApi.get<ListProductoProveedor[]>('/ProductoProveedor/ListarDetalleProductoProveedor');
        return response.data;
    } catch (error) {
        console.error("Error Listando los Productos Proveedor: ", error);
        throw error;
    }
}

export const createPreciosHistoricos = async (data: CreatePreciosHistoricosRequest) => {
    const formattedDateInicio = data.fechaInicio instanceof Date
        ? formatDateLocal(data.fechaFinalizacion)
        : formatDateLocal(new Date());

    const formattedDateFinalizacion = data.fechaFinalizacion instanceof Date
        ? formatDateLocal(data.fechaFinalizacion)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.post<CreatePreciosHistoricosRequest>('/PreciosHistoricos/CrearPreciosHistoricos', {
            idProductoProveedor: data.idProductoProveedor,
            precio: data.precio,
            fechaInicio: formattedDateInicio,
            fechaFinalizacion: formattedDateFinalizacion,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el Precio Histórico: ", error);
        throw error;
    }
}

export const updatePreciosHistoricos = async (data: CreatePreciosHistoricosRequest) => {
    const formattedDateInicio = data.fechaInicio instanceof Date
        ? formatDateLocal(data.fechaFinalizacion)
        : formatDateLocal(new Date());

    const formattedDateFinalizacion = data.fechaFinalizacion instanceof Date
        ? formatDateLocal(data.fechaFinalizacion)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.put<CreatePreciosHistoricosRequest>('/PreciosHistoricos/ActualizarPreciosHistoricos', {
            idPreciosHistoricos: data.idPreciosHistoricos,
            idProductoProveedor: data.idProductoProveedor,
            precio: data.precio,
            fechaInicio: formattedDateInicio,
            fechaEstimadaEntrega: formattedDateFinalizacion,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el Precio Histórico: ", error);
        throw error;
    }
}

export const deletePreciosHistoricos = async (idTransferencia: number) => {
    try {
        const response = await carfaithApi.delete(`/PreciosHistoricos/EliminarPreciosHistoricos/${idTransferencia}`);
        return response.data;
    } catch (error) {
        console.error("Error eliminando el Precio Histórico: ", error);
        throw error;
    }
}