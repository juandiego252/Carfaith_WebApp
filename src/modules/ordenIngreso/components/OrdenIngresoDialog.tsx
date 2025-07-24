import { Button, Card, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator } from '@/core/components'
import type { ListOrdenCompras } from '@/modules/ordenCompra/types/OrdenComprasType';
import { Plus, Package2, X } from 'lucide-react'
import type { CreateOrdenIngresoDetalleRequest, ListUbicaciones } from '../types/OrdenIngresoTypes';
import { useEffect, useState } from 'react';
import type { ProductoProveedorDetalles } from '@/modules/asociarPP/types/ProductoProveedorTypes';

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


const origenCompra = [
    { label: "Local", value: "local" },
    { label: "Nacional", value: "nacional" },
    { label: "Internacional", value: "internacional" }
];

const detalleSchema = z.object({
    idProductoProveedor: z.number().min(1, "Debes seleccionar un producto"),
    cantidad: z.number().min(1, "Cantidad requerida"),
    precioUnitario: z.number().min(0, "Precio requerido"),
    ubicacion: z.string().min(1, "Ubicación requerida"),
    tipoIngreso: z.enum(["por_cantidad", "por_lote"]),
    numeroLote: z.string().optional(),
});

const ordenIngresoSchema = z.object({
    idOrdenCompra: z.string().min(1, "Selecciona una orden de compra"),
    fecha: z.string().min(1, "Fecha requerida"),
    origenCompra: z.string().min(1, "Origen requerido"),
    estado: z.string().min(1, "Estado requerido"),
    detalles: z.array(detalleSchema).min(1, "Agrega al menos un producto"),
});

type FormValues = z.infer<typeof ordenIngresoSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingOrden?: CreateOrdenIngresoDetalleRequest,
    ordenesCompra: ListOrdenCompras[];
    asociaciones: ProductoProveedorDetalles[];
    ubicaciones: ListUbicaciones[];
    onSubmit: (data: CreateOrdenIngresoDetalleRequest) => Promise<void>;
}


export const OrdenIngresoDialog = ({ open, onOpenChange, editingOrden, ordenesCompra, onSubmit, asociaciones, ubicaciones }: Props) => {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(ordenIngresoSchema),
        defaultValues: {
            idOrdenCompra: "",
            fecha: new Date().toISOString().split('T')[0],
            origenCompra: "",
            estado: "pendiente",
            detalles: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "detalles"
    });
    // Watch form values
    const selectedIdOrdenCompra = watch("idOrdenCompra");
    // const selectedFecha = watch("fecha");
    const selectedOrigenCompra = watch("origenCompra");
    const selectedEstado = watch("estado");
    const detalles = watch("detalles");
    useEffect(() => {
        if (open && !editingOrden) {
            reset({
                idOrdenCompra: "",
                fecha: new Date().toISOString().split('T')[0],
                origenCompra: "",
                estado: "pendiente",
                detalles: []
            })
        }
        // Lógica para cargar datos de `editingOrden` si existe
        if (open && editingOrden) {
            // Aquí deberías mapear `editingOrden` a `FormValues` y usar `reset()`
            // reset(mappedEditingOrden)
        }
    }, [open, editingOrden, reset]);

    // Add a new detail to the order
    const addDetalleOrden = () => {
        append({
            idProductoProveedor: 0,
            cantidad: 1,
            precioUnitario: 0,
            ubicacion: "",
            tipoIngreso: "por_cantidad",
            numeroLote: ""
        });
    };

    const onFormSubmit = handleSubmit(async (data) => {
        try {
            setIsSubmitting(true);
            const formattedData: CreateOrdenIngresoDetalleRequest = {
                idOrdenCompra: parseInt(data.idOrdenCompra),
                fecha: new Date(data.fecha),
                origenDeCompra: data.origenCompra,
                estado: data.estado,
                detalles: data.detalles.map(detalle => ({
                    idProductoProveedor: detalle.idProductoProveedor,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precioUnitario,
                    ubicacionId: parseInt(detalle.ubicacion),
                    tipoIngreso: detalle.tipoIngreso,
                    numeroLote: detalle.numeroLote || ""
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
                                <Label htmlFor="ordenCompra" className="text-sm font-medium">Orden de Compra *</Label>
                                <Select
                                    value={selectedIdOrdenCompra}
                                    onValueChange={(value) => setValue("idOrdenCompra", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona OC" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ordenesCompra.map((oc) => (
                                            <SelectItem key={oc.idOrden} value={oc.idOrden.toString()}>
                                                {oc.numeroOrden} - {oc.nombreProveedor}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.idOrdenCompra && (
                                    <p className="text-sm text-red-500">{errors.idOrdenCompra.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha" className="text-sm font-medium">Fecha de Ingreso *</Label>
                                <Input
                                    id="fecha"
                                    type="date"
                                    className="w-full"
                                    {...register("fecha")}
                                />
                                {errors.fecha && (
                                    <p className="text-sm text-red-500">{errors.fecha.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="origen" className="text-sm font-medium">Origen de Compra *</Label>
                                <Select
                                    value={selectedOrigenCompra}
                                    onValueChange={(value) => setValue("origenCompra", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona origen" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {origenCompra.map((origen) => (
                                            <SelectItem key={origen.value} value={origen.value}>
                                                {origen.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.origenCompra && (
                                    <p className="text-sm text-red-500">{errors.origenCompra.message}</p>
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
                                            </div>

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
