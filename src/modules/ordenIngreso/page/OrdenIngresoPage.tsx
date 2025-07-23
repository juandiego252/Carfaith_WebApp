/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/core/components'
import { Package2, Clock, CheckCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { OrdenIngresoDialog } from '../components/OrdenIngresoDialog'
import type { CreateOrdenIngresoDetalleRequest } from '../types/OrdenIngresoTypes'
import { useOrdenIngresoData } from '../hooks/useOrdenIngresoData'


export const OrdenIngresoPage = () => {
    // State variables
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const [editingOrden, setEditingOrden] = useState<any>(null);
    const [selectedOrden, setSelectedOrden] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        asociaciones,
        loading,
        ordenesCompra,
        ubicaciones,
    } = useOrdenIngresoData();
    // Handle opening the create dialog
    const handleCreateOrden = () => {
        setEditingOrden(null);
        setIsCreateDialogOpen(true);
    };

    // // Handle view order details
    // const handleViewDetails = (orden: any) => {
    //     setSelectedOrden(orden);
    //     setIsDetailsDialogOpen(true);
    // };


    const handleSubmit = async (data: CreateOrdenIngresoDetalleRequest): Promise<void> => {
        try {
            setIsSubmitting(true);
            setError(null);

            await createOrdenIngreso(data);

            // Close the dialog and reset form
            setIsCreateDialogOpen(false);
            setEditingOrden(null);
        } catch (error) {
            console.error('Error al guardar la orden de ingreso:', error);
            setError('Error al guardar la orden de ingreso');
        } finally {
            setIsSubmitting(false);
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
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                        <Package2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            {/* Controls */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Órdenes de Ingreso</CardTitle>
                            <CardDescription>Gestiona las órdenes de ingreso de mercancía al inventario</CardDescription>
                        </div>
                        <Button onClick={handleCreateOrden}>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Orden de Ingreso
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
                    ) : (
                        <div className="text-center py-8">
                            <Package2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay órdenes de ingreso</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Comienza creando una nueva orden de ingreso.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Dialog for creating/editing orders */}
            <OrdenIngresoDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                editingOrden={editingOrden}
                ordenesCompra={ordenesCompra}
                asociaciones={asociaciones}
                ubicaciones={ubicaciones}
                onSubmit={handleSubmit}
            />

            {/* Dialog for viewing order details */}
            <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package2 className="h-5 w-5" />
                            Detalles de la Orden
                        </DialogTitle>
                        <DialogDescription>Detalles completos de la orden de ingreso</DialogDescription>
                    </DialogHeader>

                    {selectedOrden && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Productos</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Product details would go here */}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
