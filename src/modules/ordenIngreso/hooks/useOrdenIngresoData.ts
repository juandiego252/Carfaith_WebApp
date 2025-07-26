import type { ProductoProveedorDetalles } from "@/modules/asociarPP/types/ProductoProveedorTypes";
import type { ListOrdenCompras } from "@/modules/ordenCompra/types/OrdenComprasType";
import { useEffect, useState } from "react";
import type { ListOrdenesIngreoDetalles, ListUbicaciones } from "../types/OrdenIngresoTypes";
import { getDetalleProductoProveedor } from "@/modules/asociarPP/services/AsociarService";
import { getOrdenesIngresoDetalles, getUbicaciones } from "../services/OrdenIngresoService";
import { getOrdenesCompras } from "@/modules/ordenCompra/services/OrdenCompraService";

export const useOrdenIngresoData = () => {
    const [loading, setIsloading] = useState(true);
    const [asociaciones, setAsociaciones] = useState<ProductoProveedorDetalles[]>([]);
    const [ordenesCompra, setOrdenesCompra] = useState<ListOrdenCompras[]>([]);
    const [ubicaciones, setUbicaciones] = useState<ListUbicaciones[]>([]);
    const [ordenesIngreso, setOrdenesIngreso] = useState<ListOrdenesIngreoDetalles[]>([]);

    const loadData = async () => {
        setIsloading(true);
        try {

            const [asociacionesData, ordenesCompraData, ubicacionesData, ordenesIngresoData] = await Promise.all([
                getDetalleProductoProveedor(),
                getOrdenesCompras(),
                getUbicaciones(),
                getOrdenesIngresoDetalles()
            ]);
            setAsociaciones(asociacionesData);
            setOrdenesCompra(ordenesCompraData);
            setUbicaciones(ubicacionesData);
            setOrdenesIngreso(ordenesIngresoData);

            const processedOrdenesIngreso = ordenesIngresoData.map((orden: { idOrdenCompra: number; detalles: { idProductoProveedor: number; ubicacionId: number; }[]; }) => {
                const ordenCompra = ordenesCompraData.find(oc => oc.idOrden === orden.idOrdenCompra);

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
                    nombreProveedor: ordenCompra ? ordenCompra.nombreProveedor : 'Proveedor no encontrado',
                    numeroOrden: ordenCompra ? ordenCompra.numeroOrden : 'N/A',
                    detalles: detallesWithNames
                }
            })
            setOrdenesIngreso(processedOrdenesIngreso);
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
        ordenesIngreso,
        refreshData: loadData
    }

}
