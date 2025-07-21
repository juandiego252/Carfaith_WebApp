export interface Proveedor {
  idProveedor?: number;
  nombreProveedor: string;
  paisOrigen: string;
  tipoProveedor: string;
  telefono: string;
  email: string;
  personaContacto: string;
  fechaRegistro: string;
  ruc: string;
  direccion: string;
  estado: number;
}

export interface CreateProveedorRequest {
  nombreProveedor: string;
  paisOrigen: string;
  tipoProveedor: string;
  telefono: string;
  email: string;
  personaContacto: string;
  fechaRegistro: string;
  ruc: string;
  direccion: string;
  estado: number;
}
