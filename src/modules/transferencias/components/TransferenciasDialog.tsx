import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label, Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/core/components"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { CreateTransferenciasRequest } from "../types/TransferenciasType";

const tranferenciaSchema = z.object({
    idTransferencia: z.number().optional(),
    fecha: z
        .date()
        .refine((date) => !!date, {
            message: "La fecha es obligatoria",
        }),
    ubicacionOrigenId: z.number().int().positive("Debes seleccionar una Ubicacion de Origen"),
    ubicacionDestinoId: z.number().int().positive("Debes seleccionar una Ubicacion de Destino"),
});

type FormValues = z.infer<typeof tranferenciaSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingTransferencia: CreateTransferenciasRequest | null
    ubicaciones: {
        IdUbicacion: number,
        LugarUbicacion: string
    }[];
    onSubmit: (data: FormValues) => void;
}

export const TransferenciaDialog = ({ open, onOpenChange, editingTransferencia, ubicaciones, onSubmit }: Props) => {
    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(tranferenciaSchema),
        defaultValues: {
            idTransferencia: 0,
            fecha: new Date(),
            ubicacionOrigenId: 0,
            ubicacionDestinoId: 0,
        },
    });

    // const estado = watch("estado");

    useEffect(() => {
        if (open && editingTransferencia) {
            setValue("idTransferencia", editingTransferencia.idTransferencia);
            setValue("fecha", new Date(editingTransferencia.fecha));
            setValue("ubicacionOrigenId", editingTransferencia.ubicacionOrigenId);
            setValue("ubicacionDestinoId", editingTransferencia.ubicacionDestinoId);
        } else if (!open) {
            reset();
        }
    }, [open, editingTransferencia, setValue, reset])

    const handleFormSubmit = handleSubmit((data) => {
        const formattedData = {
            ...data,
            fechaCreacion: editingTransferencia?.fecha || new Date(),
        };
        onSubmit(formattedData);
        onOpenChange(false);
    });
    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingTransferencia ? "Editar Transferencia" : "Nueva Transferencia"}</DialogTitle>
                    <DialogDescription>
                        {editingTransferencia
                            ? "Modifica la información de la Transferencia"
                            : "Completa la información para registrar la Transferencia"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-6 py-4">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/*  <div className="grid gap-2">
                                <Label htmlFor="ubicacionOrigenId">Número de Orden *</Label>
                                <Input
                                    id="ubicacionOrigenId"
                                    placeholder="Número de Orden"
                                    {...register("ubicacionOrigenId")}
                                />
                                {errors.ubicacionOrigenId && (
                                    <p className="text-sm text-red-500">{errors.ubicacionOrigenId.message}</p>
                                )}
                            </div> */}

                            <div className="grid gap-2">
                                <Label htmlFor="ubicacionOrigenId">Ubicación de Origen *</Label>
                                <Select
                                    value={watch("ubicacionOrigenId")?.toString() || "none"}
                                    onValueChange={(value) => {
                                        if (value !== "none") {
                                            setValue("ubicacionOrigenId", parseInt(value));
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el proveedor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" disabled>
                                            Seleccione una ubicación
                                        </SelectItem>
                                        {ubicaciones?.map((prov, i) => (
                                            prov.IdUbicacion !== undefined ? (
                                                <SelectItem key={prov.IdUbicacion} value={prov.IdUbicacion.toString()}>
                                                    {prov.LugarUbicacion}
                                                </SelectItem>
                                            ) : null
                                        ))}

                                    </SelectContent>
                                </Select>
                                {errors.ubicacionOrigenId && (
                                    <p className="text-sm text-red-500">{errors.ubicacionOrigenId.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ubicacionDestinoId">Ubicación de Destino *</Label>
                                <Select
                                    value={watch("ubicacionDestinoId")?.toString() || "none"}
                                    onValueChange={(value) => {
                                        if (value !== "none") {
                                            setValue("ubicacionDestinoId", parseInt(value));
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el proveedor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none" disabled>
                                            Seleccione una ubicación
                                        </SelectItem>
                                        {ubicaciones?.map((prov, i) => (
                                            prov.IdUbicacion !== undefined ? (
                                                <SelectItem key={prov.IdUbicacion} value={prov.IdUbicacion.toString()}>
                                                    {prov.LugarUbicacion}
                                                </SelectItem>
                                            ) : null
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.ubicacionDestinoId && (
                                    <p className="text-sm text-red-500">{errors.ubicacionDestinoId.message}</p>
                                )}
                            </div>

                            {/* <div className="grid gap-2">
                                <Label htmlFor="fecha">Fecha *</Label>
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
                            </div> */}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingTransferencia ? "Actualizar" : "Crear"} Transferencia
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
