import type { ProductoProveedorDetalles } from "@/modules/asociarPP/types/ProductoProveedorTypes";
import { useEffect, useState } from "react";
import { getDetalleProductoProveedor } from "@/modules/asociarPP/services/AsociarService";
import type { ListOrdenCompras } from "../types/OrdenComprasType";
import { getOrdenesCompras, getProveedores } from "../services/OrdenCompraService";
import type { ListProveedores } from "@/modules/proveedores/types/ProveedorType";

export const useOrdenCompraData = () => {
    const [loading, setIsloading] = useState(true);
    const [asociaciones, setAsociaciones] = useState<ProductoProveedorDetalles[]>([]);
    const [ordenesCompra, setOrdenesCompra] = useState<ListOrdenCompras[]>([]);
    const [proveedores, setProveedores] = useState<ListProveedores[]>([]);


    const loadData = async () => {
        setIsloading(true);
        try {

            const [asociacionesData, proveedoresData, ordenesCompraData] = await Promise.all([
                getDetalleProductoProveedor(),
                getProveedores(),
                getOrdenesCompras(),
            ]);
            setAsociaciones(asociacionesData);
            setProveedores(proveedoresData);
            setOrdenesCompra(ordenesCompraData);

            const processedOrdenesCompra = ordenesCompraData.map((orden: { detalles: { idProductoProveedor: number; }[]; }) => {

                const detallesWithNames = orden.detalles.map((detalle: { idProductoProveedor: number; }) => {
                    const producto = asociacionesData.find(p => p.idProductoProveedor === detalle.idProductoProveedor);

                    return {
                        ...detalle,
                        nombreProducto: producto ? `${producto.codigoProducto} - ${producto.nombreProducto}` : 'Producto no encontrado',
                    }
                });

                return {
                    ...orden,
                    detalles: detallesWithNames
                }
            })
            setOrdenesCompra(processedOrdenesCompra);
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
        proveedores,
        ordenesCompra,
        refreshData: loadData
    }

}
