import { Button, Calendar, Card, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label, Popover, PopoverContent, PopoverTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator } from '@/core/components'
import { Plus, Package2, X, CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react';
import type { ProductoProveedorDetalles } from '@/modules/asociarPP/types/ProductoProveedorTypes';

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from '@/lib/utils';
import type { CreateOrdenEgresoRequest } from '../types/OrdenEgresoType';
import type { ListUbicaciones } from '@/modules/ubicaciones/types/UbicacionType';

const detalleSchema = z.object({
    idProductoProveedor: z.number().min(1, "Debes seleccionar un producto"),
    cantidad: z.number().min(1, "Cantidad requerida"),
    tipoEgreso: z.string().min(1, "Selecciona un tipo de egreso"),
    ubicacion: z.string().min(1, "Ubicación requerida"),
});

const ordenEgresoSchema = z.object({
    tipoEgreso: z.enum(["por_cantidad", "por_lote"]),
    fecha: z
        .date()
        .refine((date) => !!date, {
            message: "La fecha es obligatoria",
        }),
    destino: z.string().min(1, "Destino de egreso requerido"),
    estado: z.string().min(1, "Estado requerido"),
    detalles: z.array(detalleSchema).min(1, "Agrega al menos un producto"),
});

type FormValues = z.infer<typeof ordenEgresoSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingOrden?: CreateOrdenEgresoRequest,
    asociaciones: ProductoProveedorDetalles[];
    ubicaciones: ListUbicaciones[];
    onSubmit: (data: CreateOrdenEgresoRequest) => Promise<void>;
}


export const OrdenEgresoDialog = ({ open, onOpenChange, editingOrden, onSubmit, asociaciones, ubicaciones }: Props) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(ordenEgresoSchema),
        defaultValues: {
            tipoEgreso: "por_cantidad",
            fecha: new Date(),
            destino: "",
            estado: "pendiente",
            detalles: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "detalles"
    });

    const selectedEstado = watch("estado");
    const selectedEstadoEgreso = watch("destino");
    const detalles = watch("detalles");

    useEffect(() => {
        if (open && !editingOrden) {
            reset({
                fecha: new Date(),
                destino: "",
                estado: "pendiente",
                detalles: []
            })
        }
        else if (open && editingOrden) {
            // Mapear los datos de editingOrden al formato esperado por el formulario
            reset({
                fecha: new Date(editingOrden.fecha),
                tipoEgreso: editingOrden.tipoEgreso,
                destino: editingOrden.destino,
                estado: editingOrden.estado,
                detalles: editingOrden.detalles.map(detalle => ({
                    idProductoProveedor: detalle.idProductoProveedor,
                    cantidad: detalle.cantidad,
                    ubicacion: detalle.ubicacionId.toString(),
                }))
            });
        }
    }, [open, editingOrden, reset]);

    // Add a new detail to the order
    const addDetalleOrden = () => {
        append({
            idProductoProveedor: 0,
            cantidad: 1,
            tipoEgreso: "por_cantidad",
            ubicacion: "",
        });
    };

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            setIsSubmitting(true);
            const formattedData: CreateOrdenEgresoRequest = {
                ...(editingOrden?.idOrdenEgreso && { idOrdenEgreso: editingOrden.idOrdenEgreso }),
                tipoEgreso: data.tipoEgreso,
                fecha: data.fecha,
                destino: data.destino,
                estado: data.estado,
                detalles: data.detalles.map(detalle => ({
                    idProductoProveedor: detalle.idProductoProveedor,
                    cantidad: detalle.cantidad,
                    ubicacionId: parseInt(detalle.ubicacion),
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
                        {editingOrden ? "Editar Orden de Egreso" : "Nueva Orden de Egreso"}
                    </DialogTitle>
                    <DialogDescription>
                        {editingOrden
                            ? "Modifica la información de la orden de egreso"
                            : "Completa la información para crear una nueva orden de egreso"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onFormSubmit}>
                    <div className="space-y-6">
                        {/* Información general - formato más limpio y espaciado */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Tipo de Egreso *</Label>
                                <Select
                                    value={watch("tipoEgreso") || "por_cantidad"}
                                    onValueChange={(value) => {
                                        if (value === "por_cantidad" || value === "por_lote") {
                                            setValue("tipoEgreso", value);
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="por_cantidad">Por Cantidad</SelectItem>
                                        <SelectItem value="por_lote">Por Lote</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.tipoEgreso && (
                                    <p className="text-sm text-red-500">{errors.tipoEgreso?.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha" className="text-sm font-medium">Fecha de Egreso *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !watch("fecha") && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {watch("fecha")
                                                ? new Date(watch("fecha")).toISOString().split("T")[0]
                                                : "Selecciona una fecha"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={watch("fecha")}
                                            onSelect={(date) => date && setValue("fecha", date)}
                                            disabled={{ before: new Date() }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.fecha && (
                                    <p className="text-sm text-red-500">{errors.fecha.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="destino" className="text-sm font-medium">Destino Egreso *</Label>
                                <Select
                                    value={selectedEstadoEgreso}
                                    onValueChange={(value) => setValue("destino", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona destino de Egreso" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bodega Principal">Bodega Principal</SelectItem>
                                        <SelectItem value="Local de Venta">Local de Venta</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.destino && (
                                    <p className="text-sm text-red-500">{errors.destino.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="estado" className="text-sm font-medium">Estado *</Label>
                            <Select
                                value={selectedEstado}
                                onValueChange={(value) => setValue("estado", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                                    <SelectItem value="completado">Completado</SelectItem>
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
                                    <p className="mt-1 text-sm text-gray-500">Agrega productos a esta orden de egreso</p>
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
                                                    <Label className="text-sm font-medium">Ubicación *</Label>
                                                    <Select
                                                        value={detalles?.[index].ubicacion || ""}
                                                        onValueChange={(value) => setValue(`detalles.${index}.ubicacion`, value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona ubicación" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {ubicaciones.map((ubicacion) => (
                                                                <SelectItem key={ubicacion.idUbicacion} value={ubicacion.idUbicacion.toString()}>
                                                                    {ubicacion.lugarUbicacion}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.detalles?.[index]?.ubicacion && (
                                                        <p className="text-sm text-red-500">{errors.detalles?.[index]?.ubicacion?.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Tipo de Egreso *</Label>
                                                    <Select
                                                        value={detalles?.[index]?.tipoEgreso || "por_cantidad"}
                                                        onValueChange={(value: "por_cantidad" | "por_lote") => setValue(`detalles.${index}.tipoEgreso`, value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="por_cantidad">Por Cantidad</SelectItem>
                                                            <SelectItem value="por_lote">Por Lote</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.detalles?.[index]?.tipoEgreso && (
                                                        <p className="text-sm text-red-500">{errors.detalles?.[index]?.tipoEgreso?.message}</p>
                                                    )}
                                                </div>

                                                {/* {detalles?.[index]?.tipoEgreso === "por_lote" && (
                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium">Número de Lote</Label>
                                                        <Input
                                                            placeholder="LOT-2024-001"
                                                            {...register(`detalles.${index}.numeroLote`)}
                                                        />
                                                    </div>
                                                )} */}
                                            </div>

                                            {/* <div className="mt-5 p-3 bg-gray-50 rounded-lg">
                                                <div className="text-sm font-medium">
                                                    Subtotal: ${((detalles?.[index]?.cantidad || 0) * (detalles?.[index].precioUnitario || 0)).toLocaleString()}
                                                </div>
                                            </div> */}
                                        </Card>
                                    ))}

                                    {/* <div className="flex justify-end">
                                        <div className="text-lg font-bold">
                                            Total: ${calculateTotal().toLocaleString()}
                                        </div>
                                    </div> */}
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
