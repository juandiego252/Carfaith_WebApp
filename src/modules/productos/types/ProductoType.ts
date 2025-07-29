export interface ProductoList {
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    idLineaProdcuto: number;
    nombreLineaProducto: string;
    estado: boolean;
}

export interface LineaDeProducto {
    idLinea: number,
    nombre: string,
    descripcion: string
}

export interface CreateProductoRequest {
    codigoProducto?: string,
    nombre: string,
    estado: boolean;
    lineaDeProducto: number
}

export interface EditProductoRequest {
    idProducto: number;
    codigoProducto: string;
    nombre: string;
    estado: boolean;
    lineaDeProducto: number;
}
