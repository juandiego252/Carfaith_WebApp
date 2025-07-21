import { Badge, Button, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { Building2, MapPin, Globe, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import type { CreateProveedorRequest, ListProveedores } from "../types/ProveedorType";
import { createProveedor, deleteProveedor, editProveedor, getProveedorDetalles } from "../services/ProveedorService";
import { ProveedorDialog } from "../components/ProveedorDialog";

const tiposProveedor = [
    { label: "Local", value: "local" },
    { label: "Nacional", value: "nacional" },
    { label: "Internacional", value: "internacional" }
];

export const ProveedoresPage = () => {
    const [proveedores, setProveedores] = useState<ListProveedores[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTipo, setSelectedTipo] = useState("all")
    const [selectedEstado, setSelectedEstado] = useState("all")
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para el diálogo
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProveedor, setEditingProveedor] = useState<CreateProveedorRequest | null>(null);

    const fetchProveedores = async () => {
        try {
            setLoading(true);
            const proveedoresData = await getProveedorDetalles();
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
        fetchProveedores();
    }, []);

    const handleSubmit = async (data: {
        nombreProveedor: string;
        paisOrigen: string;
        tipoProveedor: string;
        ruc: string;
        estado: boolean;
        idProveedor?: number;
        telefono?: string;
        email?: string;
        personaContacto?: string;
        direccion?: string;
    }) => {
        try {
            setIsSubmitting(true);
            const proveedorData: CreateProveedorRequest = {
                idProveedor: data.idProveedor || 0, // Use 0 for new providers
                nombreProveedor: data.nombreProveedor,
                paisOrigen: data.paisOrigen,
                tipoProveedor: data.tipoProveedor,
                ruc: data.ruc,
                estado: data.estado,
                telefono: data.telefono || "",
                email: data.email || "",
                personaContacto: data.personaContacto || "",
                direccion: data.direccion || "",
                fechaRegistro: new Date()
            };
            if (data.idProveedor && data.idProveedor > 0) {
                await editProveedor(proveedorData);
            } else {
                await createProveedor(proveedorData);
            }
            await fetchProveedores();
            setIsDialogOpen(false);
            setEditingProveedor(null);
            setError(null);
        } catch (error) {
            console.error('Error al guardar el proveedor:', error);
            setError('Error al guardar el proveedor');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleEditProveedor = (proveedor: ListProveedores) => {
        setEditingProveedor({
            idProveedor: proveedor.idProveedor,
            nombreProveedor: proveedor.nombreProveedor,
            paisOrigen: proveedor.paisOrigen,
            tipoProveedor: proveedor.tipoProveedor,
            telefono: proveedor.telefono,
            email: proveedor.email,
            personaContacto: proveedor.personaContacto,
            ruc: proveedor.ruc,
            direccion: proveedor.direccion,
            estado: proveedor.estado,
            fechaRegistro: proveedor.fechaRegistro
        });
        setIsDialogOpen(true);
    }

    const handleDeleteProveedor = async (idProveedor: number) => {

        try {
            setIsSubmitting(true);
            await deleteProveedor(idProveedor);
            await fetchProveedores();
            setError(null);
        } catch (error) {
            console.error('Error al eliminar el proveedor:', error);
            setError('Error al eliminar el proveedor');
        } finally {
            setIsSubmitting(false);
        }

    }

    // Filtrado de proveedores
    const filteredProveedores = proveedores.filter(proveedor => {
        // Filtrar por término de búsqueda
        const searchFilter = searchTerm.toLowerCase() === '' ||
            proveedor.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proveedor.ruc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (proveedor.email && proveedor.email.toLowerCase().includes(searchTerm.toLowerCase()));

        // Filtrar por tipo
        const tipoFilter = selectedTipo === 'all' || proveedor.tipoProveedor === selectedTipo;

        // Filtrar por estado
        const estadoFilter = selectedEstado === 'all' ||
            (selectedEstado === 'activo' && proveedor.estado) ||
            (selectedEstado === 'inactivo' && !proveedor.estado);

        return searchFilter && tipoFilter && estadoFilter;
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
                        <div className="text-2xl font-bold">{proveedores.length}</div>
                        <p className="text-xs text-muted-foreground">{proveedores.filter((p) => p.estado).length} activos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proveedores Locales</CardTitle>
                        <MapPin className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{proveedores.filter((p) => p.tipoProveedor === "local").length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proveedores Nacionales</CardTitle>
                        <MapPin className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {proveedores.filter((p) => p.tipoProveedor === "nacional").length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proveedores Internacionales</CardTitle>
                        <Globe className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {proveedores.filter((p) => p.tipoProveedor === "internacional").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Controles */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle>Proveedores</CardTitle>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingProveedor(null);
                            setIsDialogOpen(true);
                        }}
                        disabled={isSubmitting}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Proveedor
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
                        <Select value={selectedTipo} onValueChange={setSelectedTipo}>
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
                        </Select>
                        <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="activo">Activos</SelectItem>
                                <SelectItem value="inactivo">Inactivos</SelectItem>
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
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Proveedor</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>País</TableHead>
                                        <TableHead>Contacto</TableHead>
                                        <TableHead>Productos</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProveedores.map((proveedor) => (
                                        <TableRow key={proveedor.idProveedor}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{proveedor.nombreProveedor}</div>
                                                    <div className="text-sm text-gray-500">{proveedor.ruc}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge>{proveedor.tipoProveedor}</Badge>
                                            </TableCell>
                                            <TableCell>{proveedor.paisOrigen}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="text-sm">{proveedor.personaContacto}</div>
                                                    <div className="text-xs text-gray-500">{proveedor.email}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{proveedor.totalProductos}</TableCell>
                                            <TableCell>
                                                <Badge variant={proveedor.estado ? "default" : "secondary"}>
                                                    {proveedor.estado ? "Activo" : "Inactivo"}
                                                </Badge>
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
                                                        <DropdownMenuItem>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver detalles
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditProveedor(proveedor)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            disabled={isSubmitting}
                                                            onClick={() => handleDeleteProveedor(proveedor.idProveedor)}
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

                    {!loading && !error && filteredProveedores.length === 0 && (
                        <div className="text-center py-8">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proveedores</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron proveedores con los filtros aplicados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Dialog para crear/editar proveedor */}
            <ProveedorDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingProveedor={editingProveedor}
                onSubmit={handleSubmit}
            />
        </div>
    )
}