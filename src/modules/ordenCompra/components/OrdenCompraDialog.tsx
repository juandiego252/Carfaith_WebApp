import { Calendar, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectTrigger, SelectValue, SelectItem, Card } from "@/core/components"
import { z } from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/core/components/ui/popover";
import { cn } from "@/lib/utils";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import type { CreateOrdenComprasRequest, ListOrdenCompras } from "../types/OrdenComprasType";
import { CalendarIcon, Package2, Plus, X } from "lucide-react";
import type { ListProveedores } from "@/modules/proveedores/types/ProveedorType";
import type { ProductoProveedorDetalles } from "@/modules/asociarPP/types/ProductoProveedorTypes";
import { Separator } from "@radix-ui/react-dropdown-menu";

const detalleSchema = z.object({
    idProductoProveedor: z.number().min(1, "Debes seleccionar un producto"),
    cantidad: z.number().min(1, "Cantidad requerida"),
    precioUnitario: z.number().min(0, "Precio requerido"),
});

const ordenCompraSchema = z.object({
    numeroOrden: z.string().optional(),
    idProveedor: z.string().min(1, "Debes seleccionar un Proveedor"),
    archivoPdf: z.string().url("Debe ser una URL válida"),
    estado: z.string().min(1, "El estado es requerido"),
    fechaEstimadaEntrega: z
        .date()
        .refine((date) => !!date, {
            message: "La fecha estimada de entrega es obligatoria",
        }),
    detalles: z.array(detalleSchema).min(1, "Agrega al menos un producto"),
});

type FormValues = z.infer<typeof ordenCompraSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingOrden: CreateOrdenComprasRequest | null
    asociaciones: ProductoProveedorDetalles[];
    proveedores: ListProveedores[];
    onSubmit: (data: CreateOrdenComprasRequest) => Promise<void>;
}

export const OrdenCompraDialog = ({ open, onOpenChange, editingOrden, asociaciones, proveedores, onSubmit }: Props) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        control,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(ordenCompraSchema),
        defaultValues: {
            numeroOrden: "",
            idProveedor: "",
            archivoPdf: "",
            estado: "En Proceso",
            fechaEstimadaEntrega: new Date(),
            detalles: []
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "detalles"
    });

    const selectedIdProveedor = watch("idProveedor");
    const selectedEstado = watch("estado");
    const detalles = watch("detalles");

    useEffect(() => {
        if (open && !editingOrden) {
            reset({
                numeroOrden: "",
                idProveedor: "",
                archivoPdf: "",
                estado: "En Proceso",
                fechaEstimadaEntrega: new Date(),
                detalles: []
            })
        }
        else if (open && editingOrden) {
            // Mapear los datos de editingOrden al formato esperado por el formulario
            reset({
                numeroOrden: editingOrden.numeroOrden,
                idProveedor: editingOrden.idProveedor.toString(),
                archivoPdf: editingOrden.archivoPdf,
                estado: editingOrden.estado,
                fechaEstimadaEntrega: new Date(editingOrden.fechaEstimadaEntrega),
                detalles: editingOrden.detalles.map(detalle => ({
                    idProductoProveedor: detalle.idProductoProveedor,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario
                }))
            });
        }
    }, [open, editingOrden, reset]);

    const addDetalleOrden = () => {
        append({
            idProductoProveedor: 0,
            cantidad: 1,
            precioUnitario: 0,
        });
    };

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            setIsSubmitting(true);
            const formattedData: CreateOrdenComprasRequest = {
                ...(editingOrden?.idOrden && { idOrdenIngreso: editingOrden.idOrden }),
                numeroOrden: data.numeroOrden,
                idProveedor: parseInt(data.idProveedor),
                archivoPdf: data.archivoPdf,
                estado: data.estado,
                fechaCreacion: editingOrden?.fechaCreacion ?? new Date(),
                fechaEstimadaEntrega: data.fechaEstimadaEntrega,
                detalles: data.detalles.map(detalle => ({
                    idProductoProveedor: detalle.idProductoProveedor,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario
                }))
            }

            await onSubmit(formattedData);
            onOpenChange(false);
        } catch (error) {
            console.log("Error al enviar el formulario:", error);
        } finally {
            setIsSubmitting(false);
        }
    });

    const calculateTotal = () => {
        return detalles?.reduce((sum, detalle) => sum + (detalle.cantidad || 0) * (
            detalle.precioUnitario || 0), 0) || 0;
    };

    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                    onClick={() => onOpenChange(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </button>

                <DialogHeader className="pb-4">
                    <DialogTitle className="text-xl font-semibold">
                        {editingOrden ? "Editar Orden de Ingreso" : "Nueva Orden de Ingreso"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingOrden
                            ? "Modifica la información de la orden de ingreso"
                            : "Completa la información para crear una nueva orden de ingreso"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onFormSubmit}>
                    <div className="space-y-6">
                        {/* Información general - formato más limpio y espaciado */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="ordenCompra" className="text-sm font-medium">Proveedor *</Label>
                                <Select
                                    value={selectedIdProveedor}
                                    onValueChange={(value) => setValue("idProveedor", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona OC" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {proveedores.map((prov) => (
                                            <SelectItem key={prov.idProveedor} value={prov.idProveedor.toString()}>
                                                {prov.nombreProveedor} - ({prov.tipoProveedor})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.idProveedor && (
                                    <p className="text-sm text-red-500">{errors.idProveedor.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="archivoPdf">Archivo PDF *</Label>
                                <Input
                                    id="archivoPdf"
                                    placeholder="https://ejemplo.com/archivo.pdf"
                                    {...register("archivoPdf")}
                                />
                                {errors.archivoPdf && (
                                    <p className="text-sm text-red-500">{errors.archivoPdf.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fechaEstimadaEntrega">Fecha estimada de entrega *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !watch("fechaEstimadaEntrega") && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {watch("fechaEstimadaEntrega")
                                                ? new Date(watch("fechaEstimadaEntrega")).toISOString().split("T")[0]
                                                : "Selecciona una fecha"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={watch("fechaEstimadaEntrega")}
                                            onSelect={(date) => date && setValue("fechaEstimadaEntrega", date)}
                                            disabled={{ before: new Date() }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.fechaEstimadaEntrega && (
                                    <p className="text-sm text-red-500">{errors.fechaEstimadaEntrega.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estado">Estado de la orden</Label>
                            <Select
                                value={selectedEstado}
                                onValueChange={(value) => setValue("estado", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona el estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="En Proceso">En proceso</SelectItem>
                                    <SelectItem value="Entregado">Entregado</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.estado && (
                                <p className="text-sm text-red-500">{errors.estado.message}</p>
                            )}
                        </div>

                        <Separator className="my-6" />

                        {/* Detalles de la orden - estilo más limpio */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">Detalles de la Orden</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addDetalleOrden}
                                    className="flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Agregar Producto
                                </Button>
                            </div>

                            {fields.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                                    <Package2 className="mx-auto h-16 w-16 text-gray-300" />
                                    <h3 className="mt-4 text-base font-medium text-gray-900">No hay productos</h3>
                                    <p className="mt-1 text-sm text-gray-500">Agrega productos a esta orden de ingreso</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <h4 className="font-medium text-base">Producto {index + 1}</h4>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                    className="rounded-full w-8 h-8 p-0"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Producto *</Label>
                                                    <Select
                                                        value={detalles?.[index]?.idProductoProveedor?.toString() || ""}
                                                        onValueChange={(value) => {
                                                            setValue(`detalles.${index}.idProductoProveedor`, parseInt(value))
                                                        }}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecciona producto" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {asociaciones.map((producto) => (
                                                                <SelectItem
                                                                    key={producto.idProductoProveedor}
                                                                    value={producto.idProductoProveedor.toString()}>
                                                                    {producto.codigoProducto} - {producto.nombreProducto}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.detalles?.[index]?.idProductoProveedor && (
                                                        <p className="text-sm text-red-500">{errors.detalles?.[index]?.idProductoProveedor?.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Cantidad *</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        {...register(`detalles.${index}.cantidad`, { valueAsNumber: true })}
                                                    />
                                                    {errors.detalles?.[index]?.cantidad && (
                                                        <p className="text-sm text-red-500">{errors.detalles?.[index]?.cantidad?.message}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Precio Unitario *</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        {...register(`detalles.${index}.precioUnitario`, { valueAsNumber: true })}
                                                    />
                                                    {errors.detalles?.[index]?.precioUnitario && (
                                                        <p className="text-sm text-red-500">{errors.detalles?.[index]?.precioUnitario?.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Tipo de Ingreso *</Label>
                                                    <Select
                                                        value={detalles?.[index]?.tipoIngreso || "por_cantidad"}
                                                        onValueChange={(value: "por_cantidad" | "por_lote") => setValue(`detalles.${index}.tipoIngreso`, value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="por_cantidad">Por Cantidad</SelectItem>
                                                            <SelectItem value="por_lote">Por Lote</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.detalles?.[index]?.tipoIngreso && (
                                                        <p className="text-sm text-red-500">{errors.detalles?.[index]?.tipoIngreso?.message}</p>
                                                    )}
                                                </div>

                                                {detalles?.[index]?.tipoIngreso === "por_lote" && (
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">Número de Lote</Label>
                                                        <Input
                                                            placeholder="LOT-2024-001"
                                                            {...register(`detalles.${index}.numeroLote`)}
                                                        />
                                                    </div>
                                                )}
                                            </div> */}

                                            <div className="mt-5 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-sm font-medium">
                                                    Subtotal: ${((detalles?.[index]?.cantidad || 0) * (detalles?.[index].precioUnitario || 0)).toLocaleString()}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}

                                    <div className="flex justify-end">
                                        <div className="text-lg font-bold">
                                            Total: ${calculateTotal().toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="min-w-[100px]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type='submit'
                                disabled={isSubmitting}
                                className="min-w-[150px]"
                            >
                                {isSubmitting
                                    ? "Guardando..."
                                    : editingOrden ? "Actualizar Orden" : "Crear Orden"}
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
