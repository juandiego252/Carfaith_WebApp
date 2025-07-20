
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Package, Tag } from "lucide-react"
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components"

// Datos de ejemplo
const lineasProducto = [
  { id: 1, nombre: "Electrónicos", descripcion: "Productos electrónicos y tecnológicos" },
  { id: 2, nombre: "Hogar", descripcion: "Artículos para el hogar" },
  { id: 3, nombre: "Oficina", descripcion: "Suministros de oficina" },
  { id: 4, nombre: "Herramientas", descripcion: "Herramientas y equipos" },
]

const productosData = [
  {
    id: 1,
    codigo: "PROD-001",
    nombre: "Laptop Dell Inspiron",
    lineaProducto: "Electrónicos",
    lineaId: 1,
    proveedores: 3,
    stock: 25,
    estado: "Activo",
  },
  {
    id: 2,
    codigo: "PROD-002",
    nombre: "Silla Ergonómica",
    lineaProducto: "Oficina",
    lineaId: 3,
    proveedores: 2,
    stock: 15,
    estado: "Activo",
  },
  {
    id: 3,
    codigo: "PROD-003",
    nombre: "Taladro Inalámbrico",
    lineaProducto: "Herramientas",
    lineaId: 4,
    proveedores: 1,
    stock: 8,
    estado: "Activo",
  },
  {
    id: 4,
    codigo: "PROD-004",
    nombre: "Microondas Samsung",
    lineaProducto: "Hogar",
    lineaId: 2,
    proveedores: 2,
    stock: 0,
    estado: "Sin Stock",
  },
  {
    id: 5,
    codigo: "PROD-005",
    nombre: "Monitor 24 pulgadas",
    lineaProducto: "Electrónicos",
    lineaId: 1,
    proveedores: 4,
    stock: 12,
    estado: "Activo",
  },
]

export const ProductosPage = () => {
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
            <div className="text-2xl font-bold"></div>
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
            <div className="text-2xl font-bold"></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"></div>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Tag className="mr-2 h-4 w-4" />
                    Líneas de Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Gestión de Líneas de Producto</DialogTitle>
                    <DialogDescription>Administra las líneas de producto disponibles</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {lineasProducto.map((linea) => (
                      <div key={linea.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{linea.nombre}</h4>
                          <p className="text-sm text-gray-600">{linea.descripcion}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Línea
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button>
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
            <Select>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por línea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las líneas</SelectItem>
                {lineasProducto.map((linea) => (
                  <SelectItem key={linea.id} value={linea.id.toString()}>
                    {linea.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tabla de productos */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Línea de Producto</TableHead>
                  <TableHead>Proveedores</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productosData.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">{producto.codigo}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.lineaProducto}</TableCell>
                    <TableCell>{producto.proveedores} proveedor(es)</TableCell>
                    <TableCell>
                      <span className={producto.stock === 0 ? "text-red-600 font-medium" : ""}>{producto.stock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          producto.estado === "Activo"
                            ? "default"
                            : producto.estado === "Sin Stock"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {producto.estado}
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
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

          {/* {filteredProductos.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron productos que coincidan con los filtros aplicados.
              </p>
            </div>
          )} */}
        </CardContent>
      </Card>

      {/* Dialog para crear/editar producto
      <Dialog>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Modifica la información del producto"
                : "Completa la información para crear un nuevo producto"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="codigo">Código del Producto</Label>
              <Input id="codigo" placeholder="PROD-001" defaultValue={editingProduct?.codigo || ""} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre del Producto</Label>
              <Input id="nombre" placeholder="Nombre del producto" defaultValue={editingProduct?.nombre || ""} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="linea">Línea de Producto</Label>
              <Select defaultValue={editingProduct?.lineaId?.toString() || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una línea" />
                </SelectTrigger>
                <SelectContent>
                  {lineasProducto.map((linea) => (
                    <SelectItem key={linea.id} value={linea.id.toString()}>
                      {linea.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción (Opcional)</Label>
              <Textarea id="descripcion" placeholder="Descripción del producto..." rows={3} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(false)}>
              {editingProduct ? "Actualizar" : "Crear"} Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
