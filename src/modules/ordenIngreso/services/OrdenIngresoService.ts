import carfaithApi from "@/core/api/carfaithApi"
import type { CreateOrdenIngresoDetalleRequest, ListUbicaciones } from "../types/OrdenIngresoTypes"
import { formatDateLocal } from "@/core/utils/DateFormatter";

export const createOrdenIngresoDetalles = async (data: CreateOrdenIngresoDetalleRequest) => {
    const formattedDate = data.fecha instanceof Date
        ? formatDateLocal(data.fecha)
        : formatDateLocal(new Date());
    try {
        const response = await carfaithApi.post<CreateOrdenIngresoDetalleRequest>("/OrdenDeIngreso/CrearOrdenIngresoConDetalles", {
            idOrdenCompra: data.idOrdenCompra,
            origenDeCompra: data.origenDeCompra,
            fecha: formattedDate,
            estado: data.estado,
            detalles: data.detalles.map(detalle => ({
                idProductoProveedor: detalle.idProductoProveedor,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                ubicacionId: detalle.ubicacionId,
                tipoIngreso: detalle.tipoIngreso,
                numeroLote: detalle.numeroLote,
            }))
        });
        return response.data;
    } catch (error) {
        console.error("Error creating OrdenIngresoDetalles:", error);
        throw error;
    }
}


export const getUbicaciones = async () => {
    try {
        const response = await carfaithApi.get<ListUbicaciones[]>("/Ubicaciones/ListarUbicaciones");
        return response.data;
    } catch (error) {
        console.error("Error fetching ubicaciones:", error);
        throw error;
    }
}


export const getOrdenesIngresoDetalles = async () => {
    try {
        const response = await carfaithApi.get("/OrdenDeIngreso/ListarOrdenesIngresoConDetalles");
        return response.data;
    } catch (error) {
        console.error("Error fetching ordenes ingreso detalles:", error);
        throw error;
    }
}