export interface ListPreciosHistoricos {
    idPreciosHistoricos: number;
    idProductoProveedor: number;
    precio: number;
    fechaInicio: Date;
    fechaFinalizacion: Date;
}

export interface CreatePreciosHistoricosRequest {
    idPreciosHistoricos: number;
    idProductoProveedor: number;
    precio: number;
    fechaInicio: Date;
    fechaFinalizacion: Date;
}

export interface ListProductoProveedor {
    idProductoProveedor: number;
    nombreProducto: string;
    codigoProducto: string;
    nombreProveedor: string;
    paisOrigen: string;
    lineaProducto: string;
}