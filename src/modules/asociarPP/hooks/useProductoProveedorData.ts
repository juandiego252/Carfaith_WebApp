import { useState, useEffect } from 'react';
import { getDetalleProductoProveedor } from '../services/AsociarService';
import { getProveedorDetalles } from '@/modules/proveedores/services/ProveedorService';
import { getProductos } from '@/modules/productos/services/ProductoService';
import type { ProductoProveedorDetalles } from '../types/ProductoProveedorTypes';
import type { ProductoList } from '@/modules/productos/types/ProductoType';
import type { ListProveedores } from '@/modules/proveedores/types/ProveedorType';

export const useProductoProveedorData = () => {
    const [loading, setLoading] = useState(true);
    const [asociaciones, setAsociaciones] = useState<ProductoProveedorDetalles[]>([]);
    const [productos, setProductos] = useState<ProductoList[]>([]);
    const [proveedores, setProveedores] = useState<ListProveedores[]>([]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [asociacionesData, proveedoresData, productosData] = await Promise.all([
                getDetalleProductoProveedor(),
                getProveedorDetalles(),
                getProductos(),
            ]);
            setAsociaciones(asociacionesData);
            setProductos(productosData);
            setProveedores(proveedoresData);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Función para recargar sólo las asociaciones
    const reloadAsociaciones = async () => {
        try {
            const asociacionesData = await getDetalleProductoProveedor();
            setAsociaciones(asociacionesData);
            return asociacionesData;
        } catch (error) {
            console.error("Error recargando asociaciones:", error);
            return [];
        }
    };

    // Obtener productos sin proveedores
    const getProductosSinProveedores = () => {
        const productosConProveedores = new Set(asociaciones.map(a => a.codigoProducto));
        return productos.filter(p => !productosConProveedores.has(p.codigoProducto));
    };

    useEffect(() => {
        loadData();
    }, []);

    return {
        loading,
        asociaciones,
        productos,
        proveedores,
        reloadAsociaciones,
        getProductosSinProveedores
    };
};