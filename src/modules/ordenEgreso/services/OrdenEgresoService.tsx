import carfaithApi from "@/core/api/carfaithApi"
import { formatDateLocal } from "@/core/utils/DateFormatter";
import type { CreateOrdenEgresoRequest } from "../types/OrdenEgresoType";

export const createOrdenEgresoDetalles = async (data: CreateOrdenEgresoRequest) => {
    const formattedDate = data.fecha instanceof Date
        ? formatDateLocal(data.fecha)
        : formatDateLocal(new Date());
        
    try {
        const response = await carfaithApi.post<CreateOrdenEgresoRequest>("/OrdenEgreso/CrearOrdenEgresoConDetalles", {
            fecha: formattedDate,
            destino: data.destino,
            estado: data.estado,
            detalles: data.detalles.map(detalle => ({
                idProductoProveedor: detalle.idProductoProveedor,
                cantidad: detalle.cantidad,
                tipoEgreso: detalle.tipoEgreso,
                ubicacionId: detalle.ubicacionId,
            }))
        });
        return response.data;
    } catch (error) {
        console.error("Error creando la Orden de Egreso con Detalles:", error);
        throw error;
    }
}

export const getOrdenesEgresoDetalles = async () => {
    try {
        const response = await carfaithApi.get("/OrdenEgreso/ListarOrdenesIngresoConDetalles");
        return response.data;
    } catch (error) {
        console.error("Error buscando ordenes de egreso detalles:", error);
        throw error;
    }
}

export const updateOrdenEgresoConDetalles = async (data: CreateOrdenEgresoRequest) => {
    const formattedDate = data.fecha instanceof Date
        ? formatDateLocal(data.fecha)
        : formatDateLocal(new Date());
    try {
        const response = await carfaithApi.put<CreateOrdenEgresoRequest>("/OrdenEgreso/EditarOrdenEgresoConDetalles", {
            idOrdenEgreso: data.idOrdenEgreso,
            fecha: formattedDate,
            destino: data.destino,
            estado: data.estado,
            detalles: data.detalles.map(detalle => ({
                idProductoProveedor: detalle.idProductoProveedor,
                cantidad: detalle.cantidad,
                tipoEgreso: detalle.tipoEgreso,
                ubicacionId: detalle.ubicacionId,
            }))
        });
        return response.data;
    } catch (error) {
        console.error("Error actualizando la Orden de Egreso con Detalles:", error);
        throw error;
    }
}

export const deleteOrdenEgresoConDetalles = async (idOrdenEgreso: number) => {
    try {
        const response = await carfaithApi.delete(`/OrdenEgreso/EliminarOrdenEgresoConDetalles/${idOrdenEgreso}`);
        return response.data;
    } catch (error) {
        console.error("Error eliminado la Orden de Egreso Detalles:", error);
        throw error;
    }
}