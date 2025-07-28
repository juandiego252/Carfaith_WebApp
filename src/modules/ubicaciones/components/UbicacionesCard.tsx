import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/core/components';
import { LucideIcon } from 'lucide-react';
import type { ProductoAgrupado } from '../hooks/useUbicaciones';

interface UbicacionCardProps {
  titulo: string;
  descripcion: string;
  Icon: LucideIcon;
  colorPrimario: string;
  colorTexto: string;
  colorFondo: string;
  totalUnidades: number;
  totalProductos: number;
  productos: ProductoAgrupado[];
  tipo: "bodega" | "local";
}

export const UbicacionCard = ({
  titulo,
  descripcion,
  Icon,
  colorPrimario,
  colorTexto,
  colorFondo,
  totalUnidades,
  totalProductos,
  productos,
  tipo
}: UbicacionCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className={`flex items-center gap-2 ${colorPrimario}`}>
          <Icon className="h-5 w-5" />
          {titulo}
        </CardTitle>
        <CardDescription className="text-gray-600">{descripcion}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 gap-3">
          <div className={`text-center p-4 rounded-lg ${colorFondo}`}>
            <div className={`text-3xl font-bold ${colorTexto}`}>{totalUnidades}</div>
            <div className="text-sm text-gray-600 mt-1">Total Unidades</div>
          </div>
          <div className={`text-center p-4 rounded-lg ${colorFondo}`}>
            <div className={`text-3xl font-bold ${colorTexto}`}>{totalProductos}</div>
            <div className="text-sm text-gray-600 mt-1">Productos</div>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {productos.map((producto) => {
            const cantidad = tipo === "bodega" ? producto.bodegaPrincipal : producto.localVenta;
            return (
              <div
                key={`${producto.id}-${producto.proveedor}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{producto.producto}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {producto.codigo} • {producto.proveedor ? `${producto.proveedor} (${producto.tipoProveedor})` : 'Sin proveedor'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${colorTexto}`}>{cantidad}</div>
                  <div className="text-xs text-gray-500">unidades</div>
                </div>
              </div>
            );
          })}

          {productos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Icon className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">No hay productos en esta ubicación</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};