export interface CreateOrdenEgresoRequest {
    idOrdenEgreso?: number;
    tipoEgreso: TipoEgreso;
    fecha: Date;
    destino: string;
    estado: string;
    detalles: Detalle[];
}

export type TipoEgreso = "por_lote" | "por_cantidad";

export interface Detalle {
    idProductoProveedor: number;
    cantidad: number;
    ubicacionId: number;
}

export interface ListOrdenesEgresoDetalles {
    idOrdenEgreso: number;
    tipoEgreso: TipoEgreso;
    fecha: Date;
    destino: string;
    estado: string;
    detalles: Detalle[];
}