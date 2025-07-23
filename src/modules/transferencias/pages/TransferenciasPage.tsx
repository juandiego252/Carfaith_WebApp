import { Button, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { Building2, Search, MoreHorizontal, Edit, Trash2, Plus, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import type { CreateTransferenciasRequest, ListTransferencias, ListUbicaciones } from "../types/TransferenciasType";
import { createTransferencias, deleteTransferencias, getTransferencias, getUbicaciones, updateTransferencias } from "../services/TransferenciasService";
import { TransferenciaDialog } from "../components/TransferenciasDialog";

export const TransferenciasPage = () => {
    const [transferencias, setTransferencias] = useState<ListTransferencias[]>([]);
    const [ubicaciones, setUbicaciones] = useState<ListUbicaciones[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedEstado, setSelectedEstado] = useState("all")
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para el diálogo
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTransferencia, setEditingTransferencia] = useState<CreateTransferenciasRequest | null>(null);

    const fetchTransferencias = async () => {
        try {
            setLoading(true);
            const [transferenciaData, ubicacionesData] = await Promise.all([
                getTransferencias(),
                getUbicaciones()
            ])
            setTransferencias(transferenciaData);
            setUbicaciones(ubicacionesData);
            setError(null);
        } catch (err) {
            setError("Error al cargar las Transferencias");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransferencias();
    }, []);

    const handleSubmit = async (data: {
        idTransferencia?: number;
        fecha: Date;
        ubicacionOrigenId?: number;
        ubicacionDestinoId: number;
    }) => {
        try {
            setIsSubmitting(true);
            const transferenciaData: CreateTransferenciasRequest = {
                idTransferencia: data.idTransferencia || 0,
                // fecha: data.fecha,
                fecha: new Date(),
                ubicacionOrigenId: data.ubicacionOrigenId || 0,
                ubicacionDestinoId: data.ubicacionDestinoId || 0
            };
            if (data.idTransferencia && data.idTransferencia > 0) {
                await updateTransferencias(transferenciaData);
            } else {
                await createTransferencias(transferenciaData);
            }
            await fetchTransferencias();
            setIsDialogOpen(false);
            setEditingTransferencia(null);
            setError(null);
        } catch (error) {
            console.error('Error al guardar la Transferencia: ', error);
            setError('Error al guardar la Transferencia');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleEditTransferencias = (transferencia: ListTransferencias) => {
        setEditingTransferencia({
            idTransferencia: transferencia.idTransferencia,
            fecha: transferencia.fecha,
            ubicacionOrigenId: transferencia.ubicacionOrigenId,
            ubicacionDestinoId: transferencia.ubicacionDestinoId,
        });
        setIsDialogOpen(true);
    }

    const handleDeleteTransferencias = async (idTransferencia: number) => {
        try {
            setIsSubmitting(true);
            await deleteTransferencias(idTransferencia);
            await fetchTransferencias();
            setError(null);
        } catch (error) {
            console.error('Error al eliminar la Transferencia:', error);
            setError('Error al eliminar la Transferencia');
        } finally {
            setIsSubmitting(false);
        }

    }

    // Filtrado de proveedores
    // const filteredTransferencias = transferencias.filter(orden => {
    //     // Filtrar por término de búsqueda
    //     const searchFilter = searchTerm.toLowerCase() === '' ||
    //         orden.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         orden.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase());

    //     // Filtrar por estado
    //     const estadoFilter = selectedEstado === 'all' ||
    //         (selectedEstado === 'Entregado' && orden.estado === 'Entregado') ||
    //         (selectedEstado === 'En Proceso' && orden.estado === 'En Proceso');

    //     return searchFilter && estadoFilter;
    // });

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
                        <div className="text-2xl font-bold">{transferencias.length}</div>
                        {/* <p className="text-xs text-muted-foreground">{transferencias.filter((p) => p.estado).length} activos</p>s */}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proveedores Locales</CardTitle>
                        <MapPin className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{transferencias.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Controles */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle>Transferencias</CardTitle>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingTransferencia(null);
                            setIsDialogOpen(true);
                        }}
                        disabled={isSubmitting}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Transferencia
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
                                        <TableHead>Transferencia</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha de Creación</TableHead>
                                        <TableHead>Fecha de Entrega Estimada</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transferencias.map((transferencia) => (
                                        <TableRow key={transferencia.idTransferencia}>
                                            <TableCell>
                                                {transferencia.fecha.toString().slice(0, 10)}
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
                                                        <DropdownMenuItem onClick={() => handleEditTransferencias(transferencia)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            disabled={isSubmitting}
                                                            onClick={() => handleDeleteTransferencias(transferencia.idTransferencia)}
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

                    {!loading && !error && transferencias.length === 0 && (
                        <div className="text-center py-8">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay Tranferencias</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron Transferencias con los filtros aplicados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Dialog para crear/editar proveedor */}
            <TransferenciaDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingTransferencia={editingTransferencia}
                ubicaciones={ubicaciones}
                onSubmit={handleSubmit}
            />
        </div>
    )
}