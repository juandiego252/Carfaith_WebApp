import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ProductoList } from '@/modules/productos/types/ProductoType';
import type { ListProveedores } from '@/modules/proveedores/types/ProveedorType';
import type { ProductoProveedorRequest } from '../types/ProductoProveedorTypes';
import { useEffect } from 'react';

// Schema para validación
const asociacionSchema = z.object({
    idProducto: z.number().min(1, "Debes seleccionar un producto"),
    idProveedor: z.number().min(1, "Debes seleccionar un proveedor"),
});
type FormValues = z.infer<typeof asociacionSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productos: ProductoList[];
    proveedores: ListProveedores[];
    editingAsociacion: ProductoProveedorRequest | null;
    onSubmit: (data: ProductoProveedorRequest) => void;
}

export const ProductoProveedorDialog = ({ open, onOpenChange, productos, proveedores, editingAsociacion, onSubmit }: Props) => {

    const { handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(asociacionSchema),
        defaultValues: {
            idProducto: 0,
            idProveedor: 0
        }
    });

    const selectedProductoId = watch("idProducto");
    const selectedProveedorId = watch("idProveedor");


    useEffect(() => {
        if (open && editingAsociacion) {
            setValue("idProducto", editingAsociacion.idProducto);
            setValue("idProveedor", editingAsociacion.idProveedor);
        } else if (!open) {
            reset();
        }
    }, [open, editingAsociacion, setValue, reset])

    const handleFormSubmit = handleSubmit((data) => {
        onSubmit(data);
        onOpenChange(false);
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingAsociacion ? "Editar Asociación" : "Nueva Asociación"}</DialogTitle>
                    <DialogDescription>
                        {editingAsociacion
                            ? "Modifica la asociación entre producto y proveedor"
                            : "Crea una nueva asociación entre producto y proveedor"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="producto">Producto *</Label>
                            <Select
                                value={selectedProductoId > 0 ? selectedProductoId.toString() : undefined}
                                onValueChange={(value) => setValue("idProducto", Number(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un producto" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productos.map((producto) => (
                                        <SelectItem key={producto.idProducto} value={producto.idProducto.toString()}>
                                            {producto.codigoProducto} - {producto.nombreProducto}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.idProducto && <p className="text-red-500 text-sm">{errors.idProducto.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="proveedor">Proveedor *</Label>
                            <Select
                                value={selectedProveedorId > 0 ? selectedProveedorId.toString() : undefined}
                                onValueChange={(value) => setValue("idProveedor", Number(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un proveedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {proveedores
                                        .filter((p) => p.estado)
                                        .map((proveedor) => (
                                            <SelectItem key={proveedor.idProveedor} value={proveedor.idProveedor.toString()}>
                                                {proveedor.nombreProveedor} ({proveedor.tipoProveedor})
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            {errors.idProveedor && <p className="text-red-500 text-sm">{errors.idProveedor.message}</p>}
                        </div>

                        {/* <div className="grid gap-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select defaultValue={editingAsociacion?.estado || "activo"}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="activo">Activo</SelectItem>
                                <SelectItem value="inactivo">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type='submit'>
                            {editingAsociacion ? "Actualizar" : "Crear"} Asociación
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}
