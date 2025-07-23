import carfaithApi from "@/core/api/carfaithApi";
import type { CreateUbicacionesRequest, ListUbicaciones } from "../types/UbicacionType";

export const getUbicaciones = async () => {
    try {
        const response = await carfaithApi.get<ListUbicaciones[]>('/Ubicaciones/ListarUbicaciones');
        return response.data;
    } catch (error) {
        console.error("Error Listando las Ubicaciones: ", error);
        throw error;
    }
}

export const createUbicaciones = async (data: CreateUbicacionesRequest) => {
    try {
        const response = await carfaithApi.post<CreateUbicacionesRequest>('/Ubicaciones/CrearUbicacion', {
            lugarUbicacion: data.lugarUbicacion,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear la Ubicación: ", error);
        throw error;
    }
}

export const updateUbicaciones = async (data: CreateUbicacionesRequest) => {
    try {
        const response = await carfaithApi.put<CreateUbicacionesRequest>('/Ubicaciones/ActualizarUbicacion', {
            idUbicacion: data.idUbicacion,
            lugarUbicacion: data.lugarUbicacion,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la Ubicación: ", error);
        throw error;
    }
}

export const deleteUbicaciones = async (idUbicacion: number) => {
    try {
        const response = await carfaithApi.delete(`/Ubicaciones/EliminarUbicacion/${idUbicacion}`);
        return response.data;
    } catch (error) {
        console.error("Error eliminando la Ubicación: ", error);
        throw error;
    }
}