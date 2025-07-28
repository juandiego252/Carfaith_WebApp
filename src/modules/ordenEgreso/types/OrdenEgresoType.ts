export interface CreateOrdenEgresoRequest {
    idOrdenEgreso?: number;
    fecha: Date;
    destino: string;
    estado: string;
    detalles: Detalle[];
}

export type TipoEgreso = "por_lote" | "por_cantidad";

export interface Detalle {
    idProductoProveedor: number;
    cantidad: number;
    tipoEgreso: string;
    ubicacionId: number;
}

export interface ListOrdenesEgresoDetalles {
    idOrdenEgreso: number;
    fecha: Date;
    destino: string;
    estado: string;
    detalles: Detalle[];
}