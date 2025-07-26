export interface ListPreciosHistoricos {
    idPreciosHistoricos: number;
    codigoProducto: string;
    nombreProducto: string;
    lineaProducto: string;
    nombreProveedor: string;
    tipoProveedor: string;
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