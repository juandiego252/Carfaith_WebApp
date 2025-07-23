import carfaithApi from "@/core/api/carfaithApi"
import type { CreateOrdenIngresoDetalleRequest, ListUbicaciones } from "../types/OrdenIngresoTypes"

export const createOrdenIngresoDetalles = async (data: CreateOrdenIngresoDetalleRequest) => {
    try {
        const response = await carfaithApi.post<CreateOrdenIngresoDetalleRequest>("/OrdenDeIngreso/CrearOrdenIngresoConDetalles", {
            data
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