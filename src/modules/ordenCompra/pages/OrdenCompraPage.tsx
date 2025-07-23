import { Badge, Button, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { Building2, Search, MoreHorizontal, Edit, Trash2, Plus, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import type { CreateOrdenComprasRequest, ListOrdenCompras } from "../types/OrdenComprasType";
import { createOrdenCompras, deleteOrdenCompras, getOrdenesCompras, getProveedores, updateOrdenCompras } from "../services/OrdenCompraService";
import { OrdenCompraDialog } from "../components/OrdenCompraDialog";
import type { ListProveedores } from "@/modules/proveedores/types/ProveedorType";

export const OrdenComprasPage = () => {
  const [ordenesCompras, setoOrdenesCompras] = useState<ListOrdenCompras[]>([]);
  const [proveedores, setProveedores] = useState<ListProveedores[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstado, setSelectedEstado] = useState("all")
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para el diálogo
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrdenCompra, setEditingOrdenCompra] = useState<CreateOrdenComprasRequest | null>(null);

  const fetchOrdenesCompras = async () => {
    try {
      setLoading(true);
      // const ordenesData = await getOrdenesCompras();
      const [ordenesData, proveedoresData] = await Promise.all([
        getOrdenesCompras(),
        getProveedores()
      ])
      setoOrdenesCompras(ordenesData);
      setProveedores(proveedoresData);
      setError(null);
    } catch (err) {
      setError("Error al cargar los proveedores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrdenesCompras();
  }, []);

  const handleSubmit = async (data: {
    idOrden?: number;
    numeroOrden: string;
    idProveedor?: number;
    archivoPdf: string;
    estado: string;
    fechaEstimadaEntrega: Date;
  }) => {
    try {
      setIsSubmitting(true);
      const ordenData: CreateOrdenComprasRequest = {
        idOrden: data.idOrden || 0,
        numeroOrden: data.numeroOrden,
        idProveedor: data.idProveedor || 0,
        archivoPdf: data.archivoPdf,
        estado: data.estado,
        fechaCreacion: new Date(),
        fechaEstimadaEntrega: data.fechaEstimadaEntrega
      };
      if (data.idOrden && data.idOrden > 0) {
        await updateOrdenCompras(ordenData);
      } else {
        await createOrdenCompras(ordenData);
      }
      await fetchOrdenesCompras();
      setIsDialogOpen(false);
      setEditingOrdenCompra(null);
      setError(null);
    } catch (error) {
      console.error('Error al guardar la Orden de Compra: ', error);
      setError('Error al guardar la Orden de Compra');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEditOrdenCompra = (ordenCompra: ListOrdenCompras) => {
    console.log(ordenCompra.fechaEstimadaEntrega)
    setEditingOrdenCompra({
      idOrden: ordenCompra.idOrden,
      numeroOrden: ordenCompra.numeroOrden,
      idProveedor: ordenCompra.idProveedor,
      archivoPdf: ordenCompra.archivoPdf,
      estado: ordenCompra.estado,
      fechaCreacion: ordenCompra.fechaCreacion,
      fechaEstimadaEntrega: ordenCompra.fechaEstimadaEntrega
    });
    setIsDialogOpen(true);
  }

  const handleDeleteOrdenCompra = async (idOrden: number) => {
    try {
      setIsSubmitting(true);
      await deleteOrdenCompras(idOrden);
      await fetchOrdenesCompras();
      setError(null);
    } catch (error) {
      console.error('Error al eliminar la Orden de Compra:', error);
      setError('Error al eliminar la Orden de Compra');
    } finally {
      setIsSubmitting(false);
    }

  }

  // Filtrado de proveedores
  const filteredOrdenCompras = ordenesCompras.filter(orden => {
    // Filtrar por término de búsqueda
    const searchFilter = searchTerm.toLowerCase() === '' ||
      orden.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtrar por estado
    const estadoFilter = selectedEstado === 'all' ||
      (selectedEstado === 'Entregado' && orden.estado === 'Entregado') ||
      (selectedEstado === 'En Proceso' && orden.estado === 'En Proceso');

    return searchFilter && estadoFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proveedores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordenesCompras.length}</div>
            <p className="text-xs text-muted-foreground">{ordenesCompras.filter((p) => p.estado).length} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores Locales</CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proveedores.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Ordenes de Compras</CardTitle>
          </div>
          <Button
            onClick={() => {
              setEditingOrdenCompra(null);
              setIsDialogOpen(true);
            }}
            disabled={isSubmitting}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nueva Orden de Compra
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, RUC o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* <Select value={selectedTipo} onValueChange={setSelectedTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tiposProveedor.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}
            <Select value={selectedEstado} onValueChange={setSelectedEstado}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Entregado">Entregados</SelectItem>
                <SelectItem value="En Proceso">En Proceso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="rounded-md border text-center">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Orden</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Orden de Compra</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                    <TableHead>Fecha de Entrega Estimada</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrdenCompras.map((orden) => (
                    <TableRow key={orden.idOrden}>
                      <TableCell>{orden.numeroOrden}</TableCell>
                      <TableCell>{orden.nombreProveedor}</TableCell>
                      <TableCell>
                        {orden.archivoPdf ? (
                          <a
                            href={orden.archivoPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
                          >
                            📄 Ver Orden de Compra
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm italic">Sin archivo</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {orden.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {orden.fechaCreacion.toString().slice(0, 10)}
                      </TableCell>
                      <TableCell>
                        {orden.fechaEstimadaEntrega.toString().slice(0, 10)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditOrdenCompra(orden)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              disabled={isSubmitting}
                              onClick={() => handleDeleteOrdenCompra(orden.idOrden)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && !error && ordenesCompras.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay Ordenes de Compra</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron Ordenes de Compra con los filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog para crear/editar proveedor */}
      <OrdenCompraDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingOrdenCompra={editingOrdenCompra}
        proveedores={proveedores}
        onSubmit={handleSubmit}
      />
    </div>
  )
}