/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components'
import { Package2, Clock, CheckCircle, Plus, Calendar, Eye, Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useOrdenEgresoData } from '../hooks/useOrdenEgresoData';
import type { CreateOrdenEgresoRequest, ListOrdenesEgresoDetalles } from '../types/OrdenEgresoType';
import { createOrdenEgresoDetalles, deleteOrdenEgresoConDetalles, updateOrdenEgresoConDetalles } from '../services/OrdenEgresoService';
import { OrdenEgresoDialog } from '../components/OrdenEgresoDialog';

export const OrdenEgresoPage = () => {
    // State variables
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [editingOrden, setEditingOrden] = useState<any>(null);
    const [selectedOrden, setSelectedOrden] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        asociaciones,
        loading,
        ubicaciones,
        ordenesEgreso,
        refreshData
    } = useOrdenEgresoData();
    // Handle opening the create dialog
    const handleCreateOrden = () => {
        setEditingOrden(null);
        setIsCreateDialogOpen(true);
    };

    // Handle view order details
    const handleViewDetails = (orden: ListOrdenesEgresoDetalles) => {
        setSelectedOrden(orden);
        setIsDetailsDialogOpen(true);
    };

    // Handle edit order
    const handleEditOrden = (orden: any) => {
        // Preparar datos para el formato esperado por el formulario de edición
        const ordenForEdit: CreateOrdenEgresoRequest = {
            idOrdenEgreso: orden.idOrdenEgreso,
            fecha: new Date(orden.fecha),
            tipoEgreso: orden.tipoEgreso,
            destino: orden.destino,
            estado: orden.estado,
            detalles: orden.detalles.map((detalle: any) => ({
                idProductoProveedor: detalle.idProductoProveedor,
                cantidad: detalle.cantidad,
                ubicacionId: detalle.ubicacionId,
            }))
        };

        setEditingOrden(ordenForEdit);
        setIsCreateDialogOpen(true);
    };

    // Handle the delete action directly
    const handleDelete = async (idOrdenEgreso: number) => {
        try {
            setIsDeleting(true);
            setError(null);
            await deleteOrdenEgresoConDetalles(idOrdenEgreso);
            refreshData();
        } catch (error) {
            console.error('Error al eliminar la orden de egreso:', error);
            setError('Error al eliminar la orden de egreso');
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pendiente':
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
            case 'en_proceso':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">En Proceso</Badge>;
            case 'completado':
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completada</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const pendingCount = ordenesEgreso.filter(orden => orden.estado.toLowerCase() === 'pendiente').length;
    const inProcessCount = ordenesEgreso.filter(orden => orden.estado.toLowerCase() === 'en_proceso').length;
    const completedCount = ordenesEgreso.filter(orden => orden.estado.toLowerCase() === 'completado').length;


    const handleSubmit = async (data: CreateOrdenEgresoRequest): Promise<void> => {
        try {
            // setIsSubmitting(true);
            setError(null);
            if (data.idOrdenEgreso) {
                // Si hay ID, es una edición
                await updateOrdenEgresoConDetalles(data);
            } else {
                // Si no hay ID, es una creación
                await createOrdenEgresoDetalles(data);
            }
            setIsCreateDialogOpen(false);
            setEditingOrden(null);
            refreshData();
        } catch (error) {
            console.error('Error al guardar la orden de egreso:', error);
            setError('Error al guardar la orden de egreso');
        } finally {
            // setIsSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header with stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                        <Package2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ordenesEgreso.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                        <Package2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inProcessCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedCount}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Controls */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Órdenes de Egreso</CardTitle>
                            <CardDescription>Gestiona las órdenes de egreso de mercancía al inventario</CardDescription>
                        </div>
                        <Button onClick={handleCreateOrden}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Orden de Egreso
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                            <strong className="font-bold">Error:</strong>
                            <span className="block sm:inline"> {error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center my-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : ordenesEgreso.length === 0 ? (
                        <div className="text-center py-8">
                            <Package2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes de egreso</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Comienza creando una nueva orden de egreso.
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-md border text-center">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center">Fecha</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-center">Productos</TableHead>
                                        <TableHead className="text-center">Destino Egreso</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ordenesEgreso.map((orden) => (
                                        <TableRow key={orden.idOrdenEgreso}>
                                            <TableCell>
                                                <div className="flex items-center justify-center">
                                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    {new Date(orden.fecha).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(orden.estado)}</TableCell>
                                            <TableCell>{orden.detalles.length} productos</TableCell>
                                            <TableCell>{orden.destino}</TableCell>
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
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditOrden(orden)}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className='text-red-600'
                                                            onClick={() => handleDelete(orden.idOrdenEgreso)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4 " />
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

            {/* Dialog for creating/editing orders */}
            <OrdenEgresoDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                editingOrden={editingOrden}
                asociaciones={asociaciones}
                ubicaciones={ubicaciones}
                onSubmit={handleSubmit}
            />
            {/* ...existing code... */}

            {/* Dialog for viewing order details */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Package2 className="h-5 w-5" />
                            Detalles de la Orden #{selectedOrden?.idOrdenEgreso}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="overflow-y-auto max-h-[75vh] space-y-6 mt-4 pr-2">
                        {selectedOrden && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="text-sm font-medium text-muted-foreground">Fecha</h4>
                                        <p>{new Date(selectedOrden.fecha).toLocaleDateString()}</p>
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
                                                    <TableHead className="w-[20%]">Tipo Egreso</TableHead>
                                                    <TableHead className="w-[20%]">Ubicación</TableHead>
                                                    <TableHead className="w-[15%]">Lote</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedOrden && selectedOrden.detalles && selectedOrden.detalles.map((detalle: any, index: any) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{detalle.nombreProducto}</TableCell>
                                                        <TableCell>{detalle.cantidad}</TableCell>
                                                        <TableCell>{selectedOrden.tipoEgreso}</TableCell>
                                                        <TableCell>{detalle.nombreUbicacion}</TableCell>
                                                        <TableCell>{detalle.numeroLote || 'N/A'}</TableCell>
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
