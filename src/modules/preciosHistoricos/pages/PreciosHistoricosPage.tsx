import { Button, Card, CardContent, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { Building2, Search, MoreHorizontal, Edit, Trash2, Plus, MapPin, Filter } from "lucide-react"
import { useEffect, useState } from "react"
import type { CreatePreciosHistoricosRequest, ListPreciosHistoricos } from "../types/PreciosHistoricosTypes";
import { createPreciosHistoricos, deletePreciosHistoricos, getPreciosHistoricos, updatePreciosHistoricos } from "../services/PreciosHistoricosService";
import { PrecioHistoricoDialog } from "../components/PreciosHistoricosDialog";
import { getLineasProductos, getProductos } from "@/modules/productos/services/ProductoService";
import type { LineaDeProducto, ProductoList } from "@/modules/productos/types/ProductoType";
import type { ListProveedores } from "@/modules/proveedores/types/ProveedorType";
import { getProveedorDetalles } from "@/modules/proveedores/services/ProveedorService";

const tiposProveedor = [
    { label: "Local", value: "local" },
    { label: "Nacional", value: "nacional" },
    { label: "Internacional", value: "internacional" }
];

export const PreciosHistoricosPage = () => {
    const [preciosHistoricos, setPreciosHistoricos] = useState<ListPreciosHistoricos[]>([]);
    const [lineasProducto, setLineasProducto] = useState<LineaDeProducto[]>([]);
    const [productos, setProductos] = useState<ProductoList[]>([]);
    const [proveedores, setProveedores] = useState<ListProveedores[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTipoProveedor, setSelectedTipoProveedor] = useState("all")
    const [selectedLineaProducto, setSelectedLineaProducto] = useState("all")
    const [selectedEstado, setSelectedEstado] = useState("all")
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para el diálogo
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPrecioHistorico, setEditingPrecioHistorico] = useState<CreatePreciosHistoricosRequest | null>(null);

    const fetchPreciosHistoricos = async () => {
        try {
            setLoading(true);
            const [precioHistoricoData, lineaProductoData, productosData, proveedoresData] = await Promise.all([
                getPreciosHistoricos(),
                getLineasProductos(),
                getProductos(),
                getProveedorDetalles()
            ])
            setPreciosHistoricos(precioHistoricoData);
            setLineasProducto(lineaProductoData);
            setProductos(productosData);
            setProveedores(proveedoresData);
            setError(null);
        } catch (err) {
            setError("Error al cargar los Precios Históricos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPreciosHistoricos();
    }, []);

    const handleSubmit = async (data: {
        idPreciosHistoricos?: number;
        idProductoProveedor?: number;
        precio: number;
        fechaInicio: Date;
        fechaFinalizacion: Date;
    }) => {
        try {
            setIsSubmitting(true);
            const precioHistoricoData: CreatePreciosHistoricosRequest = {
                idPreciosHistoricos: data.idPreciosHistoricos || 0,
                idProductoProveedor: data.idProductoProveedor || 0,
                precio: data.precio || 0,
                fechaInicio: new Date(),
                fechaFinalizacion: data.fechaFinalizacion
            };
            if (data.idPreciosHistoricos && data.idPreciosHistoricos > 0) {
                await updatePreciosHistoricos(precioHistoricoData);
            } else {
                await createPreciosHistoricos(precioHistoricoData);
            }
            await fetchPreciosHistoricos();
            setIsDialogOpen(false);
            setEditingPrecioHistorico(null);
            setError(null);
        } catch (error) {
            console.error('Error al guardar el Precio Historico: ', error);
            setError('Error al guardar el Precio Historico');
        } finally {
            setIsSubmitting(false);
        }
    }

    // const handleEditTransferencias = (precioHistorico: ListPreciosHistoricos) => {
    //     setEditingPrecioHistorico({
    //         idPreciosHistoricos: precioHistorico.idPreciosHistoricos,
    //         // idProductoProveedor: precioHistorico.idProductoProveedor,
    //         precio: precioHistorico.precio,
    //         fechaInicio: precioHistorico.fechaInicio,
    //         fechaFinalizacion: precioHistorico.fechaFinalizacion,
    //     });
    //     setIsDialogOpen(true);
    // }

    // Filtrado de proveedores
    const filteredPrecios = preciosHistoricos.filter(precio => {
        // Filtrar por término de búsqueda
        const searchFilter = searchTerm.toLowerCase() === '' ||
            precio.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            precio.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            precio.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            precio.tipoProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            precio.lineaProducto.toLowerCase().includes(searchTerm.toLowerCase());

        const tipoProveedorFilter = selectedTipoProveedor === 'all' || precio.tipoProveedor === selectedTipoProveedor;
        const lineaProductoFilter = selectedLineaProducto === 'all' || precio.lineaProducto === selectedLineaProducto;

        return searchFilter && tipoProveedorFilter && lineaProductoFilter;
    });

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Precios Historicos</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{preciosHistoricos.length}</div>
                        {/* <p className="text-xs text-muted-foreground">{transferencias.filter((p) => p.estado).length} activos</p>s */}
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

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos</CardTitle>
                        <MapPin className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productos.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Controles */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle>Precios Históricos</CardTitle>
                    </div>
                    {/* <Button
                        onClick={() => {
                            setEditingPrecioHistorico(null);
                            setIsDialogOpen(true);
                        }}
                        disabled={isSubmitting}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Precio Historico
                    </Button> */}
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
                        <Select value={selectedTipoProveedor} onValueChange={setSelectedTipoProveedor}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Tipo de Proveedor" />
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

                        <Select value={selectedLineaProducto} onValueChange={setSelectedLineaProducto}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Tipo de Proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos las lineas</SelectItem>
                                {lineasProducto.map((linea) => (
                                    <SelectItem key={linea.nombre} value={linea.nombre}>
                                        {linea.nombre}
                                    </SelectItem>
                                ))}
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
                                        <TableHead className="text-center">Código de Producto</TableHead>
                                        <TableHead className="text-center">Producto</TableHead>
                                        <TableHead className="text-center">Línea de Producto</TableHead>
                                        <TableHead className="text-center">Proveedor</TableHead>
                                        <TableHead className="text-center">Tipo de Proveedor</TableHead>
                                        <TableHead className="text-center">Fecha de Inicio</TableHead>
                                        <TableHead className="text-center">Fecha de Finalización</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPrecios.map((precioHistorico) => (
                                        <TableRow key={precioHistorico.idPreciosHistoricos}>
                                            <TableCell>
                                                {precioHistorico.codigoProducto}
                                            </TableCell>
                                            <TableCell>
                                                {precioHistorico.nombreProducto}
                                            </TableCell>
                                            <TableCell>
                                                {precioHistorico.lineaProducto}
                                            </TableCell>
                                            <TableCell>
                                                {precioHistorico.nombreProveedor}
                                            </TableCell>
                                            <TableCell>
                                                {precioHistorico.tipoProveedor}
                                            </TableCell>
                                            <TableCell>
                                                {precioHistorico.fechaInicio.toString().slice(0, 10)}
                                            </TableCell>
                                            <TableCell>
                                                {precioHistorico.fechaFinalizacion.toString().slice(0, 10)}
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
                                                        {/* <DropdownMenuItem onClick={() => handleEditTransferencias(precioHistorico)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem> */}
                                                        <DropdownMenuSeparator />
                                                        {/* <DropdownMenuItem
                                                            className="text-red-600"
                                                            disabled={isSubmitting}
                                                            onClick={() => handleDeleteTransferencias(precioHistorico.idPreciosHistoricos)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem> */}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!loading && !error && preciosHistoricos.length === 0 && (
                        <div className="text-center py-8">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay Precios Historicos</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron Precios Historicos con los filtros aplicados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Dialog para crear/editar Precio Historico */}
            <PrecioHistoricoDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingPrecioHistorico={editingPrecioHistorico}
                // productosProveedor={productoProveedor}
                onSubmit={handleSubmit}
            />
        </div>
    )
}