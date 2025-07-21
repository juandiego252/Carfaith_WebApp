import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const productoSchema = z.object({
    idProducto: z.number().optional(),
    codigoProducto: z.string().min(1, "El codigo es requerido"),
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lineaDeProducto: z.number().int().positive("Debes seleccionar una línea de Producto")
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
    }[]
    onSubmit: (data: FormValues) => void;
}

export const ProductoDialog = ({ open, onOpenChange, editingProduct, lineasProductos, onSubmit }: Props) => {

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
        const formattedData = {
            idProducto: data.idProducto,
            codigoProducto: data.codigoProducto,
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
                        <div className="grid gap-2">
                            <Label htmlFor="codigo">Código del Producto</Label>
                            <Input
                                id="codigo"
                                placeholder="PROD-001"
                                {...register("codigoProducto")}
                            />
                            {
                                errors.codigoProducto && (
                                    <p className="text-sm text-red-500">{errors.codigoProducto.message}</p>
                                )
                            }
                        </div>

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
                                value={selectedLineaId?.toString() || ""}
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