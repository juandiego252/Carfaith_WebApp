import carfaithApi from "@/core/api/carfaithApi";
import type { ListStock } from "../types/StockType";

export const getStock = async () => {
    try {
        const response = await carfaithApi.get<ListStock[]>('/Stock/ListarInfoStock');
        return response.data;
    } catch (error) {
        console.error("Error Listando el Stock: ", error);
        throw error;
    }
}

// export const createUbicaciones = async (data: CreateUbicacionesRequest) => {
//     try {
//         const response = await carfaithApi.post<CreateUbicacionesRequest>('/Ubicaciones/CrearUbicacion', {
//             lugarUbicacion: data.lugarUbicacion,
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error al crear la Ubicación: ", error);
//         throw error;
//     }
// }

// export const updateUbicaciones = async (data: CreateUbicacionesRequest) => {
//     try {
//         const response = await carfaithApi.put<CreateUbicacionesRequest>('/Ubicaciones/ActualizarUbicacion', {
//             idUbicacion: data.idUbicacion,
//             lugarUbicacion: data.lugarUbicacion,
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error al actualizar la Ubicación: ", error);
//         throw error;
//     }
// }

// export const deleteUbicaciones = async (idUbicacion: number) => {
//     try {
//         const response = await carfaithApi.delete(`/Ubicaciones/EliminarUbicacion/${idUbicacion}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error eliminando la Ubicación: ", error);
//         throw error;
//     }
// }