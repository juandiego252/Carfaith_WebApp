import carfaithApi from "@/core/api/carfaithApi";
import { formatDateLocal } from "@/core/utils/DateFormatter";
import type { CreateTransferenciasRequest, ListTransferencias, ListUbicaciones } from "../types/TransferenciasType";

export const getTransferencias = async () => {
    try {
        const response = await carfaithApi.get<ListTransferencias[]>('/Transferencias/ListarTransferencias');
        return response.data;
    } catch (error) {
        console.error("Error Listando las Transferencias: ", error);
        throw error;
    }
}

export const getUbicaciones = async () => {
    try {
        const response = await carfaithApi.get<ListUbicaciones[]>('/Ubicaciones/ListarUbicaciones');
        return response.data;
    } catch (error) {
        console.error("Error Listando los Ubicaciones: ", error);
        throw error;
    }
}

export const createTransferencias = async (data: CreateTransferenciasRequest) => {
    const formattedDateFecha = data.fecha instanceof Date
        ? formatDateLocal(data.fecha)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.post<CreateTransferenciasRequest>('/Transferencias/CrearTransferencia', {
            fecha: formattedDateFecha,
            ubicacionOrigenId: data.ubicacionOrigenId,
            ubicacionDestinoId: data.ubicacionDestinoId,
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear la Transferencia: ", error);
        throw error;
    }
}

export const updateTransferencias = async (data: CreateTransferenciasRequest) => {
    const formattedDateFecha = data.fecha instanceof Date
        ? formatDateLocal(data.fecha)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.put<CreateTransferenciasRequest>('/Transferencias/ActualizarTransferencia', {
            idTransferencia: data.idTransferencia,
            fechaEstimadaEntrega: formattedDateFecha,
            ubicacionOrigenId: data.ubicacionOrigenId,
            ubicacionDestinoId: data.ubicacionDestinoId,
        });
        return response.data;
    } catch (error) {
        console.error("Error al actualizar la Transferencia: ", error);
        throw error;
    }
}

export const deleteTransferencias = async (idTransferencia: number) => {
    try {
        const response = await carfaithApi.delete(`/Transferencias/EliminarTransferencia/${idTransferencia}`);
        return response.data;
    } catch (error) {
        console.error("Error eliminando la Transferencia: ", error);
        throw error;
    }
}