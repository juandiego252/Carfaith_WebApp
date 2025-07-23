import { Calendar, Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/core/components"
import { z } from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/core/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { CreateOrdenComprasRequest } from "../types/OrdenComprasType";
import { CalendarIcon } from "lucide-react";

const ordenCompraSchema = z.object({
    idOrden: z.number().optional(),
    numeroOrden: z.string().min(1, "El número de orden es requerido"),
    idProveedor: z.number().int().positive("Debes seleccionar un Proveedor"),
    archivoPdf: z.string().url("Debe ser una URL válida"),
    estado: z.string().min(1, "El estado es requerido"),
    fechaEstimadaEntrega: z
        .date()
        .refine((date) => !!date, {
            message: "La fecha estimada de entrega es obligatoria",
        }),
});

type FormValues = z.infer<typeof ordenCompraSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingOrdenCompra: CreateOrdenComprasRequest | null
    proveedores: {
        idProveedor: number,
        nombreProveedor: string
    }[];
    onSubmit: (data: FormValues) => void;
}

export const OrdenCompraDialog = ({ open, onOpenChange, editingOrdenCompra, proveedores, onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(ordenCompraSchema),
        defaultValues: {
            idOrden: 0,
            numeroOrden: "",
            idProveedor: 0,
            archivoPdf: "",
            estado: "",
            fechaEstimadaEntrega: new Date(),
        },
    });

    const estado = watch("estado");

    useEffect(() => {
        if (open && editingOrdenCompra) {
            setValue("idOrden", editingOrdenCompra.idOrden);
            setValue("numeroOrden", editingOrdenCompra.numeroOrden);
            setValue("idProveedor", editingOrdenCompra.idProveedor);
            setValue("archivoPdf", editingOrdenCompra.archivoPdf);
            setValue("estado", editingOrdenCompra.estado);
            setValue("fechaEstimadaEntrega", new Date(editingOrdenCompra.fechaEstimadaEntrega));
        } else if (!open) {
            reset();
        }
    }, [open, editingOrdenCompra, setValue, reset])

    const handleFormSubmit = handleSubmit((data) => {
        const formattedData = {
            ...data,
            fechaCreacion: editingOrdenCompra?.fechaCreacion || new Date(),
            fechaEstimadaEntrega: data.fechaEstimadaEntrega,
        };
        onSubmit(formattedData);
        onOpenChange(false);
    });
    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingOrdenCompra ? "Editar Orden de Compra" : "Nuevo Orden de Compra"}</DialogTitle>
                    <DialogDescription>
                        {editingOrdenCompra
                            ? "Modifica la información de la Orden de Compra"
                            : "Completa la información para registrar la Orden de Compra"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-6 py-4">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="numeroOrden">Número de Orden *</Label>
                                <Input
                                    id="numeroOrden"
                                    placeholder="Número de Orden"
                                    {...register("numeroOrden")}
                                />
                                {errors.numeroOrden && (
                                    <p className="text-sm text-red-500">{errors.numeroOrden.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="idProveedor">Proveedor *</Label>
                                <Select
                                    value={watch("idProveedor")?.toString() || "none"}
                                    onValueChange={(value) => {
                                        if (value !== "none") {
                                            setValue("idProveedor", parseInt(value));
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el proveedor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" disabled>
                                            Seleccione un proveedor
                                        </SelectItem>
                                        {proveedores?.map((prov) => (
                                            <SelectItem key={prov.idProveedor} value={prov.idProveedor.toString()}>
                                                {prov.nombreProveedor}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.idProveedor && (
                                    <p className="text-sm text-red-500">{errors.idProveedor.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="archivoPdf">Archivo PDF *</Label>
                                <Input
                                    id="archivoPdf"
                                    placeholder="20123456789"
                                    {...register("archivoPdf")}
                                />
                                {errors.archivoPdf && (
                                    <p className="text-sm text-red-500">{errors.archivoPdf.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="estado">Estado de la orden</Label>
                                <Select
                                    value={estado || ""}
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

                            <div className="grid gap-2">
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
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingOrdenCompra ? "Actualizar" : "Crear"} Orden de Compra
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
