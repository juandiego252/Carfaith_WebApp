import carfaithApi from "@/core/api/carfaithApi"
import type { CreateProveedorRequest, ListProveedores } from "../types/ProveedorType";
import { formatDateLocal } from "@/core/utils/DateFormatter";


export const getProveedorDetalles = async () => {
    try {
        const response = await carfaithApi.get<ListProveedores[]>('/Proveedores/ListarProveedoresDetalles');
        return response.data;
    } catch (error) {
        console.error("Error fetching provider details:", error);
        throw error;
    }
}


export const createProveedor = async (data: CreateProveedorRequest) => {
    const formattedDate = data.fechaRegistro instanceof Date
        ? formatDateLocal(data.fechaRegistro)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.post<CreateProveedorRequest>('Proveedores/CrearProveedor', {
            nombreProveedor: data.nombreProveedor,
            paisOrigen: data.paisOrigen,
            tipoProveedor: data.tipoProveedor,
            telefono: data.telefono,
            email: data.email,
            personaContacto: data.personaContacto,
            fechaRegistro: formattedDate,
            ruc: data.ruc,
            direccion: data.direccion,
            estado: data.estado
        });
        return response.data;
    } catch (error) {
        console.error("Error creating provider:", error);
        throw error;
    }
}

export const editProveedor = async (data: CreateProveedorRequest) => {
    const formattedDate = data.fechaRegistro instanceof Date
        ? formatDateLocal(data.fechaRegistro)
        : formatDateLocal(new Date());

    try {
        const response = await carfaithApi.put<CreateProveedorRequest>('/Proveedores/ActualizarProveedor', {
            idProveedor: data.idProveedor,
            nombreProveedor: data.nombreProveedor,
            paisOrigen: data.paisOrigen,
            tipoProveedor: data.tipoProveedor,
            telefono: data.telefono,
            email: data.email,
            personaContacto: data.personaContacto,
            fechaRegistro: formattedDate,
            ruc: data.ruc,
            direccion: data.direccion,
            estado: data.estado
        });
        return response.data;
    } catch (error) {
        console.error("Error editing provider:", error);
        throw error;
    }
}

export const deleteProveedor = async (idProveedor: number) => {
    try {
        const response = await carfaithApi.delete(`/Proveedores/EliminarProveedor/${idProveedor}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting provider:", error);
        throw error;
    }
}