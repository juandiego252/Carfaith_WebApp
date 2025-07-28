import type { ProductoProveedorDetalles } from "@/modules/asociarPP/types/ProductoProveedorTypes";
import type { ListUbicaciones } from "@/modules/ubicaciones/types/UbicacionType";
import { useEffect, useState } from "react";
import type { ListOrdenesEgresoDetalles } from "../types/OrdenEgresoType";
import { getDetalleProductoProveedor } from "@/modules/asociarPP/services/AsociarService";
import { getUbicaciones } from "@/modules/ubicaciones/services/UbicacionesServices";
import { getOrdenesEgresoDetalles } from "../services/OrdenEgresoService";

export const useOrdenEgresoData = () => {
    const [loading, setIsloading] = useState(true);
    const [asociaciones, setAsociaciones] = useState<ProductoProveedorDetalles[]>([]);
    const [ubicaciones, setUbicaciones] = useState<ListUbicaciones[]>([]);
    const [ordenesEgreso, setOrdenesEgreso] = useState<ListOrdenesEgresoDetalles[]>([]);

    const loadData = async () => {
        setIsloading(true);
        try {

            const [asociacionesData, ubicacionesData, ordenesEgresoData] = await Promise.all([
                getDetalleProductoProveedor(),
                getUbicaciones(),
                getOrdenesEgresoDetalles()
            ]);
            setAsociaciones(asociacionesData);
            setUbicaciones(ubicacionesData);
            setOrdenesEgreso(ordenesEgresoData);

            const processedOrdenesEgreso = ordenesEgresoData.map((orden: { detalles: { idProductoProveedor: number; ubicacionId: number; }[]; }) => {

                const detallesWithNames = orden.detalles.map((detalle: { idProductoProveedor: number; ubicacionId: number; }) => {
                    const producto = asociacionesData.find(p => p.idProductoProveedor === detalle.idProductoProveedor);
                    const ubicacion = ubicacionesData.find(u => u.idUbicacion === detalle.ubicacionId);

                    return {
                        ...detalle,
                        nombreProducto: producto ? `${producto.codigoProducto} - ${producto.nombreProducto}` : 'Producto no encontrado',
                        nombreUbicacion: ubicacion ? ubicacion.lugarUbicacion : 'Ubicación no encontrada'
                    }
                });

                return {
                    ...orden,
                    detalles: detallesWithNames
                }
            })
            setOrdenesEgreso(processedOrdenesEgreso);
        } catch (error) {
            console.error("Error cargando los datos:", error);
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
        ubicaciones,
        ordenesEgreso,
        refreshData: loadData
    }

}
