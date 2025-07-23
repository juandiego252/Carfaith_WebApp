export interface CreateOrdenIngresoDetalleRequest {
    idOrdenCompra:  number;
    origenDeCompra: string;
    fecha:          Date;
    estado:         string;
    detalles:       Detalle[];
}
export type TipoIngreso = "por_lote" | "por_cantidad";

export interface Detalle {
    idProductoProveedor: number;
    cantidad:            number;
    precioUnitario:      number;
    ubicacionId:         number;
    tipoIngreso:         TipoIngreso;
    numeroLote:          string;
}
export interface ListUbicaciones {
    idUbicacion:    number;
    lugarUbicacion: string;
}
