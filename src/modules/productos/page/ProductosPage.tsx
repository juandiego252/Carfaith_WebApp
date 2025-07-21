import { Plus, Search, MoreHorizontal, Edit, Trash2, Package, Tag } from "lucide-react"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"
import { useEffect, useState } from "react"
import { createProducto, deleteProducto, editProducto, getLineasProductos, getProductos } from "../services/ProductoService";
import type { EditProductoRequest, LineaDeProducto, ProductoList } from "../types/ProductoType";
import { ProductoDialog } from "../components/ProductoDialog";

export const ProductosPage = () => {
  // Estados para productos y UI
  const [productos, setProductos] = useState<ProductoList[]>([]);
  const [lineasProducto, setLineasProducto] = useState<LineaDeProducto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para el dialogo
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EditProductoRequest | null>(null);

  // Función para cargar productos que podemos reutilizar
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const [productosData, lineasProductoData] = await Promise.all([
        getProductos(),
        getLineasProductos()
      ])
      setProductos(productosData);
      setLineasProducto(lineasProductoData);
      setError(null);
    } catch (err) {
      setError("Error al cargar los productos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductos();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (data: {
    idProducto?: number,
    codigoProducto: string,
    nombre: string,
    lineaDeProducto: number
  }) => {
    try {
      setIsSubmitting(true);

      if (data.idProducto) {
        await editProducto({
          idProducto: data.idProducto,
          codigoProducto: data.codigoProducto,
          nombre: data.nombre,
          lineaDeProducto: data.lineaDeProducto
        });
      } else {
        await createProducto({
          codigoProducto: data.codigoProducto,
          nombre: data.nombre,
          lineaDeProducto: data.lineaDeProducto
        });
      }

      await fetchProductos();

      setIsDialogOpen(false);

    } catch (error) {
      console.error('Error al guardar el producto:', error);
      setError("Error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (idProducto: number) => {
    try {
      setIsSubmitting(true);
      await deleteProducto(idProducto);
      await fetchProductos();
      setError(null);
    } catch (error) {
      console.log('Error al eliminar el producto:', error);
      setError('Error al eliminar el producto');
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Líneas de Producto</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lineasProducto.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Activos</CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Lista de Productos</CardTitle>
              <CardDescription>Gestiona todos los productos del inventario</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsDialogOpen(true);
                }}
                disabled={isSubmitting}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
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
                placeholder="Buscar productos por nombre o código..."
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Línea de Producto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto) => (
                    <TableRow key={producto.idProducto}>
                      <TableCell className="font-medium">{producto.codigoProducto}</TableCell>
                      <TableCell>{producto.nombreProducto}</TableCell>
                      <TableCell>{producto.nombreLineaProducto}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingProduct({
                                  idProducto: producto.idProducto,
                                  codigoProducto: producto.codigoProducto,
                                  nombre: producto.nombreProducto,
                                  lineaDeProducto: producto.idLineaProdcuto
                                });
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(producto.idProducto)}
                              disabled={isSubmitting}
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

          {!loading && !error && productos.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron productos en el sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <ProductoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingProduct={editingProduct ? {
          id: editingProduct.idProducto,
          codigoProducto: editingProduct.codigoProducto,
          nombreProducto: editingProduct.nombre,
          idLineaProdcuto: editingProduct.lineaDeProducto
        } : null}
        lineasProductos={lineasProducto.map(l => ({ id: l.idLinea, nombreLineaProducto: l.nombre }))}
        onSubmit={handleSubmit}
      />
    </div>
  )
}