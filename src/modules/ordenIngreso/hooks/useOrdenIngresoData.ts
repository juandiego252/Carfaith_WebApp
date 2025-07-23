import type { ProductoProveedorDetalles } from "@/modules/asociarPP/types/ProductoProveedorTypes";
import type { ListOrdenCompras } from "@/modules/ordenCompra/types/OrdenComprasType";
import { useEffect, useState } from "react";
import type { ListUbicaciones } from "../types/OrdenIngresoTypes";
import { getDetalleProductoProveedor } from "@/modules/asociarPP/services/AsociarService";
import { getUbicaciones } from "../services/OrdenIngresoService";
import { getOrdenesCompras } from "@/modules/ordenCompra/services/OrdenCompraService";

export const useOrdenIngresoData = () => {
    const [loading, setIsloading] = useState(true);
    const [asociaciones, setAsociaciones] = useState<ProductoProveedorDetalles[]>([]);
    const [ordenesCompra, setOrdenesCompra] = useState<ListOrdenCompras[]>([]);
    const [ubicaciones, setUbicaciones] = useState<ListUbicaciones[]>([]);

    const loadData = async () => {
        setIsloading(true);
        try {

            const [asociacionesData, ordenesCompraData, ubicacionesData] = await Promise.all([
                getDetalleProductoProveedor(),
                getOrdenesCompras(),
                getUbicaciones(),
            ]);
            setAsociaciones(asociacionesData);
            setOrdenesCompra(ordenesCompraData);
            setUbicaciones(ubicacionesData);

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsloading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    return {
        loading,
        asociaciones,
        ordenesCompra,
        ubicaciones,
    }

}
