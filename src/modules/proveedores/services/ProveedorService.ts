import carfaithApi from "@/core/api/carfaithApi";
import type {
  CreateProveedorRequest,
  Proveedor,
} from "../../productos/types/ProveedorType";

export const getProveedores = async () => {
  try {
    const response = await carfaithApi.get<Proveedor[]>(
      "/Proveedores/ListarProveedores"
    );
    return response.data;
  } catch (error) {
    console.log("Error al buscar los proveedores", error);
    throw error;
  }
};

export const crearProveedor = async (data: CreateProveedorRequest) => {
  try {
    console.log("Enviando proveedor al backend:", data);
    const response = await carfaithApi.post<CreateProveedorRequest>(
      "/Proveedores/CrearProveedor",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear al proveedor:", error);
    throw error;
  }
};
