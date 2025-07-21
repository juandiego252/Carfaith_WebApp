export interface ListProveedores {
    idProveedor: number;
    nombreProveedor: string;
    paisOrigen: string;
    tipoProveedor: string;
    telefono: string;
    email: string;
    personaContacto: string;
    fechaRegistro: Date;
    ruc: string;
    direccion: string;
    estado: boolean;
    totalProductos: number;
    totalOrdenes: number;
}

export interface CreateProveedorRequest {
    idProveedor: number;
    nombreProveedor: string;
    paisOrigen: string;
    tipoProveedor: string;
    telefono: string;
    email: string;
    personaContacto: string;
    fechaRegistro: Date;
    ruc: string;
    direccion: string;
    estado: boolean;
}
