import { getStock } from '@/modules/stock/services/StockService';
import { useEffect, useState } from 'react';

// Definición de tipos
export interface StockItem {
  idStock: number;
  cantidad: number;
  codigoProducto: string;
  nombreProducto: string;
  nombreProveedor: string;
  tipoProveedor: string;
  lugarUbicacion: string;
}

export interface ProductoAgrupado {
  id: number;
  codigo: string;
  producto: string;
  proveedor?: string;
  tipoProveedor?: string;
  lineaProducto: string;
  bodegaPrincipal: number;
  localVenta: number;
}

export interface UbicacionData {
  productos: ProductoAgrupado[];
  totalUnidades: number;
  totalProductos: number;
}

export const useUbicaciones = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  
  // Cargar datos desde la API
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        const data = await getStock();
        setStockItems(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar el stock:", err);
        setError("Error al cargar la información de ubicaciones");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, []);
  
  // Procesar datos para Bodega
  const bodegaData: UbicacionData = {
    productos: procesarProductosPorUbicacion(stockItems, "Bodega"),
    totalUnidades: calcularTotalUnidades(stockItems, "Bodega"),
    totalProductos: calcularTotalProductosUnicos(stockItems, "Bodega")
  };
  
  // Procesar datos para Local
  const localData: UbicacionData = {
    productos: procesarProductosPorUbicacion(stockItems, "Local"),
    totalUnidades: calcularTotalUnidades(stockItems, "Local"),
    totalProductos: calcularTotalProductosUnicos(stockItems, "Local")
  };

  return {
    loading,
    error,
    bodegaData,
    localData
  };
};

// Funciones auxiliares
function procesarProductosPorUbicacion(stockItems: StockItem[], ubicacion: string): ProductoAgrupado[] {
  const productosMap = new Map<string, ProductoAgrupado>();
  
  stockItems.forEach(item => {
    if (item.lugarUbicacion === ubicacion) {
      const key = `${item.codigoProducto}-${item.nombreProveedor}`;
      
      if (!productosMap.has(key)) {
        productosMap.set(key, {
          id: item.idStock,
          codigo: item.codigoProducto,
          producto: item.nombreProducto,
          proveedor: item.nombreProveedor,
          tipoProveedor: item.tipoProveedor,
          lineaProducto: item.tipoProveedor, // Asumiendo que tipoProveedor es la línea del producto
          bodegaPrincipal: 0,
          localVenta: 0
        });
      }
      
      const producto = productosMap.get(key)!;
      if (ubicacion === 'Bodega') {
        producto.bodegaPrincipal += item.cantidad;
      } else {
        producto.localVenta += item.cantidad;
      }
    }
  });
  
  return Array.from(productosMap.values());
}

function calcularTotalUnidades(stockItems: StockItem[], ubicacion: string): number {
  return stockItems
    .filter(item => item.lugarUbicacion === ubicacion)
    .reduce((total, item) => total + item.cantidad, 0);
}

function calcularTotalProductosUnicos(stockItems: StockItem[], ubicacion: string): number {
  const productosProveedoresUnicos = new Set(
    stockItems
      .filter(item => item.lugarUbicacion === ubicacion)
      .map(item => `${item.codigoProducto}-${item.nombreProveedor}`)
  );

  return productosProveedoresUnicos.size;
}