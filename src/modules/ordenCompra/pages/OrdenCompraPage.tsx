import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, DialogHeader, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { Building2, Search, MoreHorizontal, Edit, Trash2, Plus, MapPin, Package2, Eye } from "lucide-react"
import { useState } from "react"
import type { CreateOrdenComprasRequest, ListOrdenCompras } from "../types/OrdenComprasType";
import { createOrdenCompras, deleteOrdenCompras, updateOrdenCompras } from "../services/OrdenCompraService";
import { OrdenCompraDialog } from "../components/OrdenCompraDialog";
import { useOrdenCompraData } from "../hooks/useOrdenCompraData";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

export const OrdenComprasPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstado, setSelectedEstado] = useState("all")
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingOrden, setEditingOrden] = useState<any>(null);
  const [selectedOrden, setSelectedOrden] = useState<any>(null);

  const {
    loading,
    asociaciones,
    proveedores,
    ordenesCompra,
    refreshData
  } = useOrdenCompraData();

  const handleCreateOrden = () => {
    setEditingOrden(null);
    setIsCreateDialogOpen(true);
  };

  // Handle view order details
  const handleViewDetails = (orden: ListOrdenCompras) => {
    setSelectedOrden(orden);
    setIsDetailsDialogOpen(true);
  };

  const handleEditOrden = (orden: any) => {
    // Preparar datos para el formato esperado por el formulario de edición
    const ordenForEdit: CreateOrdenComprasRequest = {
      idOrden: orden.idOrden,
      numeroOrden: orden.numeroOrden,
      idProveedor: orden.idProveedor,
      archivoPdf: orden.archivoPdf,
      estado: orden.estado,
      fechaCreacion: new Date(orden.fechaCreacion),
      fechaEstimadaEntrega: new Date(orden.fechaEstimadaEntrega),
      detalles: orden.detalles.map((detalle: any) => ({
        idProductoProveedor: detalle.idProductoProveedor,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
      }))
    };

    setEditingOrden(ordenForEdit);
    setIsCreateDialogOpen(true);
  };

  // Handle the delete action directly
  const handleDelete = async (idOrden: number) => {
    try {
      setIsDeleting(true);
      setError(null);
      await deleteOrdenCompras(idOrden);
      refreshData();
    } catch (error) {
      console.error('Error al eliminar la orden de compra:', error);
      setError('Error al eliminar la orden de compra');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case 'en proceso':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En Proceso</Badge>;
      case 'completada':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const inProcessCount = ordenesCompra.filter(orden => orden.estado.toLowerCase() === 'En Proceso').length;
  const completedCount = ordenesCompra.filter(orden => orden.estado.toLowerCase() === 'Entregado').length;

  const handleSubmit = async (data: CreateOrdenComprasRequest): Promise<void> => {
    try {
      // setIsSubmitting(true);
      setError(null);
      if (data.idOrden) {
        // Si hay ID, es una edición
        await updateOrdenCompras(data);
      } else {
        // Si no hay ID, es una creación
        await createOrdenCompras(data);
      }
      setIsCreateDialogOpen(false);
      setEditingOrden(null);
      refreshData();
    } catch (error) {
      console.error('Error al guardar la orden de compra:', error);
      setError('Error al guardar la orden de compra');
    } finally {
      // setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes de Compra en Proceso</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{ordenesCompra.length}</div> */}
            <p className="text-xs text-muted-foreground">{inProcessCount} En Proceso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes de Compra Entregados</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordenesCompra.length}</div>
            <p className="text-xs text-muted-foreground">{completedCount} Entregados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
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
            <CardDescription>Gestiona las órdenes de compra de mercancía.</CardDescription>
          </div>
          <Button
            onClick={handleCreateOrden}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Órden de Compra
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : ordenesCompra.length === 0 ? (
            <div className="text-center py-8">
              <Package2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes de compra</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando una nueva orden de compra.
              </p>
            </div>
          ) : (
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
                  {ordenesCompra.map((orden) => (
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
                            <DropdownMenuItem onClick={() => handleViewDetails(orden)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditOrden(orden)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(orden.idOrden)}
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
        </CardContent>
      </Card>

      {/* Dialog para crear/editar proveedor */}
      <OrdenCompraDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        editingOrden={editingOrden}
        asociaciones={asociaciones}
        proveedores={proveedores}
        onSubmit={handleSubmit}
      />

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package2 className="h-5 w-5" />
              Detalles de la Órden de Compra #{selectedOrden?.idOrden}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Detalles de la orden de compra seleccionada.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[75vh] space-y-6 mt-4 pr-2">
            {selectedOrden && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Fecha de Creación</h4>
                    <p>{new Date(selectedOrden.fechaCreacion).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Fecha de Entrega Estimada</h4>
                    <p>{new Date(selectedOrden.fechaEstimadaEntrega).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Estado</h4>
                    <p>{getStatusBadge(selectedOrden.estado)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Total productos</h4>
                    <p>{selectedOrden.detalles.length}</p>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Productos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/4">Producto</TableHead>
                          <TableHead className="w-[15%]">Cantidad</TableHead>
                          {/* <TableHead className="w-[20%]">Tipo Egreso</TableHead> */}
                          {/* <TableHead className="w-[20%]">Ubicación</TableHead> */}
                          {/* <TableHead className="w-[15%]">Lote</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrden && selectedOrden.detalles && selectedOrden.detalles.map((detalle: any, index: any) => (
                          <TableRow key={index}>
                            <TableCell>{detalle.nombreProducto}</TableCell>
                            <TableCell>{detalle.cantidad}</TableCell>
                            {/* <TableCell>{selectedOrden.tipoEgreso}</TableCell> */}
                            {/* <TableCell>{detalle.nombreUbicacion}</TableCell> */}
                            {/* <TableCell>{detalle.numeroLote || 'N/A'}</TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}