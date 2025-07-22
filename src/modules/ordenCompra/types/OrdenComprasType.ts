export interface ListOrdenCompras {
  idOrden: number;
  numeroOrden: string;
  idProveedor: number;
  nombreProveedor: string;
  archivoPdf: string;
  estado: string;
  fechaCreacion: Date;
  fechaEstimadaEntrega: Date;
}

export interface CreateOrdenComprasRequest {
  idOrden: number;
  numeroOrden: string;
  idProveedor: number;
  archivoPdf: string;
  estado: string;
  fechaCreacion: Date;
  fechaEstimadaEntrega: Date;
}