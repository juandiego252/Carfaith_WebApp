import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label } from "@/core/components"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { CreateUbicacionesRequest } from "../types/UbicacionType";

const ubicacionSchema = z.object({
    idUbicacion: z.number().optional(),
    lugarUbicacion: z.string().min(5, "La ubicacion es requerida"),
});

type FormValues = z.infer<typeof ubicacionSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingUbicacion: CreateUbicacionesRequest | null
    onSubmit: (data: FormValues) => void;
}

export const UbicacionDialog = ({ open, onOpenChange, editingUbicacion, onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(ubicacionSchema),
        defaultValues: {
            idUbicacion: 0,
            lugarUbicacion: "",
        },
    });

    useEffect(() => {
        if (open && editingUbicacion) {
            setValue("idUbicacion", editingUbicacion.idUbicacion);
            setValue("lugarUbicacion", editingUbicacion.lugarUbicacion);
        } else if (!open) {
            reset();
        }
    }, [open, editingUbicacion, setValue, reset])

    const handleFormSubmit = handleSubmit((data) => {
        const formattedData = {
            ...data,
        };
        onSubmit(formattedData);
        onOpenChange(false);
    });
    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingUbicacion ? "Editar Ubicación" : "Nueva Ubicación"}</DialogTitle>
                    <DialogDescription>
                        {editingUbicacion
                            ? "Modifica la información de la Ubicación"
                            : "Completa la información para registrar la Ubicación"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-6 py-4">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="lugarUbicacion">Lugar Ubicación *</Label>
                                <Input
                                    id="lugarUbicacion"
                                    placeholder="Cuenca, Av. Américas"
                                    className="w-full"
                                    {...register("lugarUbicacion")}
                                />
                                {errors.lugarUbicacion && (
                                    <p className="text-sm text-red-500">{errors.lugarUbicacion.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingUbicacion ? "Actualizar" : "Crear"} Ubicación
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
