import { Button, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { Building2, Search, MoreHorizontal, Edit, Trash2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import type { CreateUbicacionesRequest, ListUbicaciones } from "../types/UbicacionType";
import { createUbicaciones, deleteUbicaciones, getUbicaciones, updateUbicaciones } from "../services/UbicacionesServices";
import { UbicacionDialog } from "../components/UbicacionesDialog";

export const UbicacionesPage = () => {
    const [ubicaciones, setUbicaciones] = useState<ListUbicaciones[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para el diálogo
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUbicacion, setEditingubicacion] = useState<CreateUbicacionesRequest | null>(null);

    const fetchUbicaciones = async () => {
        try {
            setLoading(true);
            const [ubicacionesData] = await Promise.all([
                getUbicaciones()
            ]);
            setUbicaciones(ubicacionesData);
            setError(null);
        } catch (err) {
            setError("Error al cargar las Ubicaciones");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUbicaciones();
    }, []);

    const handleSubmit = async (data: {
        idUbicacion?: number;
        lugarUbicacion: string;
    }) => {
        try {
            setIsSubmitting(true);
            const ubicacionData: CreateUbicacionesRequest = {
                idUbicacion: data.idUbicacion || 0,
                lugarUbicacion: data.lugarUbicacion,
            };
            if (data.idUbicacion && data.idUbicacion > 0) {
                await updateUbicaciones(ubicacionData);
            } else {
                await createUbicaciones(ubicacionData);
            }
            await fetchUbicaciones();
            setIsDialogOpen(false);
            setEditingubicacion(null);
            setError(null);
        } catch (error) {
            console.error('Error al guardar la Ubicación: ', error);
            setError('Error al guardar la Ubicación');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleEditUbicaciones = (ubicacion: ListUbicaciones) => {
        setEditingubicacion({
            idUbicacion: ubicacion.idUbicacion,
            lugarUbicacion: ubicacion.lugarUbicacion,
        });
        setIsDialogOpen(true);
    }

    const handleDeleteUbicaciones = async (idUbicacion: number) => {
        try {
            setIsSubmitting(true);
            await deleteUbicaciones(idUbicacion);
            await fetchUbicaciones();
            setError(null);
        } catch (error) {
            console.error('Error al eliminar la Ubicación:', error);
            setError('Error al eliminar la Ubicación');
        } finally {
            setIsSubmitting(false);
        }

    }

    // Filtrado de ubicaciones
    const filteredUbicaciones = ubicaciones.filter(ubicacion => {
        // Filtrar por término de búsqueda
        const searchFilter = searchTerm.toLowerCase() === '' ||
            ubicacion.lugarUbicacion.toLowerCase().includes(searchTerm.toLowerCase());

        return searchFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Ubicaciones</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ubicaciones.length}</div>
                        {/* <p className="text-xs text-muted-foreground">{transferencias.filter((p) => p.estado).length} activos</p>s */}
                    </CardContent>
                </Card>
            </div>

            {/* Controles */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle>Ubicaciones</CardTitle>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingubicacion(null);
                            setIsDialogOpen(true);
                        }}
                        disabled={isSubmitting}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Ubicación
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por ubicación..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
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
                                        <TableHead>Lugar Ubicación</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUbicaciones.map((ubicacion) => (
                                        <TableRow key={ubicacion.idUbicacion}>
                                            <TableCell>
                                                {ubicacion.lugarUbicacion}
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
                                                        <DropdownMenuItem onClick={() => handleEditUbicaciones(ubicacion)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            disabled={isSubmitting}
                                                            onClick={() => handleDeleteUbicaciones(ubicacion.idUbicacion)}
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

                    {!loading && !error && filteredUbicaciones.length === 0 && (
                        <div className="text-center py-8">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay Ubicacioes</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron Ubicacioes con los filtros aplicados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Dialog para crear/editar proveedor */}
            <UbicacionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingUbicacion={editingUbicacion}
                onSubmit={handleSubmit}
            />
        </div>
    )
}