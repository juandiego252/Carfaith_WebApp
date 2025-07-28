import { Store, Warehouse } from 'lucide-react';
import { useUbicaciones } from '../hooks/useUbicaciones';
import { UbicacionCard } from '../components/UbicacionesCard';

export const UbicacionesPage = () => {
  const { loading, error, bodegaData, localData } = useUbicaciones();

  if (loading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


        {/* Local de Venta */}
        <UbicacionCard
          titulo="Local de Venta"
          descripcion="Productos disponibles para venta directa"
          Icon={Store}
          colorPrimario="text-green-600"
          colorTexto="text-green-600"
          colorFondo="bg-green-50"
          totalUnidades={localData.totalUnidades}
          totalProductos={localData.totalProductos}
          productos={localData.productos}
          tipo="local"
        />
        {/* Bodega Principal */}
        <UbicacionCard
          titulo="Bodega Principal"
          descripcion="Almacén principal de mercancía"
          Icon={Warehouse}
          colorPrimario="text-blue-600"
          colorTexto="text-blue-600"
          colorFondo="bg-blue-50"
          totalUnidades={bodegaData.totalUnidades}
          totalProductos={bodegaData.totalProductos}
          productos={bodegaData.productos}
          tipo="bodega"
        />
      </div>
    </div>
  );
};