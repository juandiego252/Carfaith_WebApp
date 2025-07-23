export interface ProductoProveedorRequest {
    idProductoProveedor?: number;
    idProducto:          number;
    idProveedor:         number;
}
export interface ProductoProveedorDetalles {
    idProductoProveedor: number;
    nombreProducto:      string;
    codigoProducto:      string;
    nombreProveedor:     string;
    paisOrigen:          string;
    lineaProducto:       string;
}
export interface MassiveAsociationRequest {
    idProducto:     number;
    idsProveedores: number[];
}