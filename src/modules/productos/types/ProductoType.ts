export interface ProductoList {
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    idLineaProdcuto: number;
    nombreLineaProducto: string;
}

export interface LineaDeProducto {
    idLinea: number,
    nombre: string,
    descripcion: string
}

export interface CreateProductoRequest {
    codigoProducto: string,
    nombre: string,
    lineaDeProducto: number
}
