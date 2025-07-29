export interface ListOrdenCompras {
  idOrden: number;
  numeroOrden: string;
  idProveedor: number;
  nombreProveedor: string;
  archivoPdf: string;
  estado: string;
  fechaCreacion: Date;
  fechaEstimadaEntrega: Date;
  detalles: Detalle[];
}

export interface CreateOrdenComprasRequest {
  idOrden?: number;
  numeroOrden?: string;
  idProveedor: number;
  archivoPdf: string;
  estado: string;
  fechaCreacion: Date;
  fechaEstimadaEntrega: Date;
  detalles: Detalle[];
}

export interface Detalle {
  idProductoProveedor: number;
  cantidad: number;
  precioUnitario: number;
}