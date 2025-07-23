import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/core/components'
import { Package, Building2, AlertTriangle, Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Link } from 'lucide-react'
import { AsociasionMasivaDialog } from '../components/AsociasionMasivaDialog'
import { useProductoProveedorData } from '../hooks/useProductoProveedorData'
import { useProductoProveedorFilter } from '../hooks/useProductoProveedorFilter'
import { useProductoProveedorActions } from '../hooks/useProductoProveedorActions'
import { useTipoProveedorBadge } from '../hooks/useTipoProveedorBadge'
import { ProductoProveedorDialog } from '../components/ProductoProveedorDialog'

export const ProductosProveedoresPage = () => {
    // Hooks personalizados
    const { loading, asociaciones, productos, proveedores, reloadAsociaciones, getProductosSinProveedores } = useProductoProveedorData();
    const { searchTerm, setSearchTerm, selectedTipo, setSelectedTipo, filteredAsociaciones } = useProductoProveedorFilter(asociaciones);
    const { getTipoProveedorBadge } = useTipoProveedorBadge();
    const {
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isMassiveDialogOpen,
        setIsMassiveDialogOpen,
        editingAsociacion,
        handleCreateAsociacion,
        handleEditAsociacion,
        handleSubmitAsociacion,
        handleMassiveAssociationSuccess,
        handleOpenMassiveDialog,
        handleDeleteAsociacion
    } = useProductoProveedorActions(productos, proveedores, reloadAsociaciones);
    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Asociaciones</CardTitle>
                        <Link className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{asociaciones.length}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos Asociados</CardTitle>
                        <Package className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(asociaciones.map(a => a.codigoProducto)).size}
                        </div>
                        <p className="text-xs text-muted-foreground">de {productos.length} productos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
                        <Building2 className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Set(asociaciones.map(a => a.nombreProveedor)).size}
                        </div>
                        <p className="text-xs text-muted-foreground">proveedores únicos</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sin Proveedores</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getProductosSinProveedores().length}</div>
                        <p className="text-xs text-muted-foreground">productos sin asociar</p>
                    </CardContent>
                </Card>
            </div>

            {/* Alertas */}
            {getProductosSinProveedores().length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle className="text-orange-800 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Productos sin Proveedores
                        </CardTitle>
                        <CardDescription className="text-orange-700">
                            Los siguientes productos no tienen proveedores asociados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {getProductosSinProveedores().map((producto) => (
                                <Badge key={producto.idProducto} variant="outline" className="border-orange-300 text-orange-800">
                                    {producto.codigoProducto} - {producto.nombreProducto}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Controles */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Asociaciones Producto - Proveedor</CardTitle>
                            <CardDescription>Gestiona las relaciones entre productos y proveedores</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleOpenMassiveDialog}>
                                <Link className="mr-2 h-4 w-4" />
                                Asociación Masiva
                            </Button>
                            <Button onClick={handleCreateAsociacion}>
                                <Plus className="mr-2 h-4 w-4" />
                                Nueva Asociación
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por producto, código o proveedor..."
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
                                <SelectItem value="all">Todos los paises</SelectItem>
                                {Array.from(new Set(asociaciones.map(a => a.paisOrigen))).map((pais) => (
                                    <SelectItem key={pais} value={pais}>
                                        {pais}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tabla de asociaciones */}
                    {loading ? (
                        <div className="flex justify-center my-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>

                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Proveedor</TableHead>
                                        <TableHead>País</TableHead>
                                        <TableHead>Línea Producto</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAsociaciones.map((asociacion) => {
                                        const paisBadge = getTipoProveedorBadge(asociacion.paisOrigen)
                                        return (
                                            <TableRow key={asociacion.idProductoProveedor}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{asociacion.nombreProducto}</div>
                                                        <div className="text-sm text-gray-500">{asociacion.codigoProducto}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{asociacion.nombreProveedor}</TableCell>
                                                <TableCell>
                                                    <Badge className={paisBadge.className}>
                                                        {asociacion.paisOrigen}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{asociacion.lineaProducto}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleEditAsociacion(asociacion)}>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => handleDeleteAsociacion(asociacion.idProductoProveedor)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Eliminar
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!loading && filteredAsociaciones.length === 0 && (
                        <div className="text-center py-8">
                            <Link className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay asociaciones</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontraron asociaciones que coincidan con los filtros aplicados.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            <AsociasionMasivaDialog
                open={isMassiveDialogOpen}
                onOpenChange={setIsMassiveDialogOpen}
                productos={productos}
                proveedores={proveedores}
                onSuccess={handleMassiveAssociationSuccess}

            />

            <ProductoProveedorDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                productos={productos}
                proveedores={proveedores}
                editingAsociacion={editingAsociacion}
                onSubmit={handleSubmitAsociacion}
            />
        </div>
    )
}
