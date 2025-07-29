import { Card, CardContent, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { Building2, Search, Warehouse } from "lucide-react"
import { useEffect, useState } from "react"
import type { ListStock } from "../types/StockType";
import { getStock } from "../services/StockService";

export const StockPage = () => {
    const [stock, setStock] = useState<ListStock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("")

    const fetchStock = async () => {
        try {
            setLoading(true);
            const [stockData] = await Promise.all([
                getStock()
            ]);
            setStock(stockData);
            setError(null);
        } catch (err) {
            setError("Error al cargar el Stock");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStock();
    }, []);

    // Filtrado de ubicaciones
    const filteredStock = stock.filter(stock => {
        // Filtrar por término de búsqueda
        const searchFilter =
            searchTerm.toLowerCase() === '' ||
            stock.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.tipoProveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.lugarUbicacion.toLowerCase().includes(searchTerm.toLowerCase());

        return searchFilter;
    });

    const productosConStock = stock.filter(s => s.cantidad > 0).length;
    const productosSinStock = stock.filter(s => s.cantidad === 0).length;

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Card: Productos con stock */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos con Stock</CardTitle>
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productosConStock}</div>
                    </CardContent>
                </Card>

                {/* Card: Productos sin stock */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Productos sin Stock</CardTitle>
                        <Warehouse className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">{productosSinStock}</div>
                    </CardContent>
                </Card>
            </div>


            {/* Controles */}
            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <CardTitle>Stock de Productos</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar por nombre, código o proveedor..."
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
                                        <TableHead className="text-center">Código de Producto</TableHead>
                                        <TableHead className="text-center">Producto</TableHead>
                                        <TableHead className="text-center">Proveedor</TableHead>
                                        <TableHead className="text-center">Tipo de Proveedor</TableHead>
                                        <TableHead className="text-center">Ubicación del Producto</TableHead>
                                        <TableHead className="text-center">Cantidad en Stock</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStock.map((stock) => (
                                        <TableRow key={stock.idStock}>
                                            <TableCell>
                                                {stock.codigoProducto}
                                            </TableCell>
                                            <TableCell>
                                                {stock.nombreProducto}
                                            </TableCell>
                                            <TableCell>
                                                {stock.nombreProveedor}
                                            </TableCell>
                                            <TableCell>
                                                {stock.tipoProveedor}
                                            </TableCell>
                                            <TableCell>
                                                {stock.lugarUbicacion}
                                            </TableCell>
                                            <TableCell>
                                                {stock.cantidad}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!loading && !error && filteredStock.length === 0 && (
                        <div className="text-center py-8">
                            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay Stock</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No se encontro Stock del Producto buscado.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Dialog para crear/editar proveedor */}
            {/* <UbicacionDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                editingUbicacion={editingUbicacion}
                onSubmit={handleSubmit}
            /> */}
        </div>
    )
}