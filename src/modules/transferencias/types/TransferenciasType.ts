export interface ListTransferencias {
    idTransferencia: number;
    fecha: Date;
    ubicacionOrigenId: number;
    ubicacionDestinoId: number;
}

export interface ListUbicaciones {
    IdUbicacion: number;
    LugarUbicacion: string;
}

export interface CreateTransferenciasRequest {
    idTransferencia: number;
    fecha: Date;
    ubicacionOrigenId: number;
    ubicacionDestinoId: number;
}