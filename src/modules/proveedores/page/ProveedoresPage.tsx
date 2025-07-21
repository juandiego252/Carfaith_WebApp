import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
  Tag,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components";
import { useEffect, useState } from "react";
import type {
  CreateProveedorRequest,
  Proveedor,
} from "../../productos/types/ProveedorType";
import { crearProveedor, getProveedores } from "../services/ProveedorService";
import { ProveedorDialog } from "../components/ProveedorDialog";

export const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para el dialogo
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(
    null
  );

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const data = await getProveedores();
      setProveedores(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar los proveedores");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (data: CreateProveedorRequest) => {
    try {
      setIsSubmitting(true);

      // Agrego fechaRegistro actual y aseguro estado como string
      const formattedData: CreateProveedorRequest = {
        ...data,
        fechaRegistro: new Date().toISOString(),
        estado: data.estado,
      };

      await crearProveedor(formattedData);

      await fetchProveedores();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error al guardar el proveedor:", error);
      setError("Error al guardar el proveedor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Proveedores
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proveedores.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Líneas de Producto
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Productos Activos
            </CardTitle>
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
              <CardTitle>Lista de Proveedores</CardTitle>
              <CardDescription>
                Gestiona todos los Proveedores del sistema
              </CardDescription>
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar proveedores por nombre..."
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
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* Tabla de proveedores */}
          {!loading && !error && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Pais de Orígen</TableHead>
                    <TableHead>Tipo de Proveedor</TableHead>
                    <TableHead>Telefono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Persona de Contacto</TableHead>
                    <TableHead>Fecha de Registro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proveedores.map((proveedor) => (
                    <TableRow key={proveedor.idProveedor}>
                      <TableCell className="font-medium">
                        {proveedor.nombreProveedor}
                      </TableCell>
                      <TableCell>{proveedor.paisOrigen}</TableCell>
                      <TableCell>{proveedor.tipoProveedor}</TableCell>
                      <TableCell>{proveedor.telefono}</TableCell>
                      <TableCell>{proveedor.email}</TableCell>
                      <TableCell>{proveedor.personaContacto}</TableCell>
                      <TableCell>
                        {proveedor.fechaRegistro &&
                          new Date(
                            proveedor.fechaRegistro
                          ).toLocaleDateString()}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={proveedor.estado ? "default" : "destructive"}
                        >
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
          )}

          {!loading && !error && proveedores.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No hay proveedores
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron proveedores en el sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <ProveedorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingProveedor={editingProveedor}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
