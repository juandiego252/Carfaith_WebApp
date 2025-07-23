import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const productoSchema = z.object({
    idProducto: z.number().optional(),
    codigoProducto: z.string().optional(),
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lineaDeProducto: z.number().int().positive("Debes seleccionar una línea de Producto"),
});

type FormValues = z.infer<typeof productoSchema>


interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingProduct?: {
        id?: number,
        codigoProducto: string,
        nombreProducto: string,
        idLineaProdcuto?: number,
        nombreLineaProducto?: string
    } | null
    lineasProductos: {
        id: number,
        nombreLineaProducto: string
    }[];
    productos: {
        id?: number,
        codigoProducto: string,
        nombreProducto: string,
        idLineaProdcuto?: number,
        nombreLineaProducto?: string
    }[];
    onSubmit: (data: {
        idProducto?: number;
        codigoProducto?: string;
        nombre: string;
        lineaDeProducto: number;
    }) => void;
}

export const ProductoDialog = ({ open, onOpenChange, editingProduct, lineasProductos, onSubmit, productos }: Props) => {

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(productoSchema),
        defaultValues: {
            idProducto: undefined,
            codigoProducto: "",
            nombre: "",
            lineaDeProducto: 0
        }
    })

    useEffect(() => {
        if (open && editingProduct) {
            if (editingProduct.id) {
                setValue("idProducto", editingProduct.id);
            }
            setValue("codigoProducto", editingProduct.codigoProducto);
            setValue("nombre", editingProduct.nombreProducto);
            if (editingProduct.idLineaProdcuto) {
                setValue("lineaDeProducto", editingProduct.idLineaProdcuto);
            }
        } else if (!open) {
            reset();
        }
    }, [open, editingProduct, setValue, reset]);

    const selectedLineaId = watch("lineaDeProducto");

    const handleFormSubmit = handleSubmit((data) => {
        // Verificar si existe un producto con el mismo nombre (solo cuando se crea un nuevo producto)
        if (!editingProduct) {
            const productoExistente = productos.find(
                prod => prod.nombreProducto.toLowerCase() === data.nombre.toLowerCase()
            );

            if (productoExistente) {
                // Mostrar error y detener el envío

                alert(`El producto "${data.nombre}" ya existe.`);
                return;
            }
        } else {
            // Al editar, verificar que no exista otro producto con el mismo nombre
            const otroProductoConMismoNombre = productos.find(
                prod => prod.nombreProducto.toLowerCase() === data.nombre.toLowerCase() &&
                    prod.id !== editingProduct.id
            );
            if (otroProductoConMismoNombre) {
                alert(`Ya existe otro producto llamado "${data.nombre}".`);
                return;
            }
        }
        const formattedData = {
            idProducto: data.idProducto,
            codigoProducto: editingProduct ? editingProduct.codigoProducto : undefined,
            nombre: data.nombre,
            lineaDeProducto: data.lineaDeProducto
        }
        onSubmit(formattedData);
        onOpenChange(false);
    })


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                    <DialogDescription>
                        {editingProduct
                            ? "Modifica la información del producto"
                            : "Completa la información para crear un nuevo producto"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-4 py-4">
                        {editingProduct && (
                            <div className="grid gap-2">
                                <Label htmlFor="codigo">Código del Producto</Label>
                                <Input
                                    id="codigo"
                                    placeholder="PROD-001"
                                    {...register("codigoProducto")}
                                    disabled={true}
                                    className="bg-gray-100 text-gray-700"
                                />
                                {errors.codigoProducto && (
                                    <p className="text-sm text-red-500">{errors.codigoProducto.message}</p>
                                )}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="nombre">Nombre del Producto</Label>
                            <Input
                                id="nombre"
                                placeholder="Nombre del producto"
                                {...register("nombre")}
                            />
                            {errors.nombre && (
                                <p className="text-sm text-red-500">{errors.nombre.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="linea">Línea de Producto</Label>
                            <Select
                                value={selectedLineaId ? selectedLineaId.toString() : ""}
                                onValueChange={(value) => setValue("lineaDeProducto", parseInt(value, 10))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una línea" />
                                </SelectTrigger>
                                <SelectContent>
                                    {lineasProductos.map((linea) => (
                                        <SelectItem key={linea.id} value={linea.id.toString()}>
                                            {linea.nombreLineaProducto}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.lineaDeProducto && (
                                <p className="text-sm text-red-500">{errors.lineaDeProducto.message}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingProduct ? "Actualizar" : "Crear"} Producto
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog >
    )
}