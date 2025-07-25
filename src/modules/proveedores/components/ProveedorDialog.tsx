import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectTrigger, SelectValue, SelectItem, Switch, Textarea } from "@/core/components"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateProveedorRequest } from "../types/ProveedorType";
import { useEffect } from "react";

const tiposProveedor = [
    { label: "Local", value: "local" },
    { label: "Nacional", value: "nacional" },
    { label: "Internacional", value: "internacional" }
];

const proveedorSchema = z.object({
    idProveedor: z.number().optional(),
    nombreProveedor: z.string().min(1, "El nombre es requerido"),
    paisOrigen: z.string().min(1, "El país de origen es requerido"),
    tipoProveedor: z.string().min(1, "El tipo de proveedor es requerido"),
    telefono: z.string()
        .refine(val => val === '' || /^\+?\d+$/.test(val), {
            message: "El teléfono debe contener solo números y puede iniciar con +"
        }),
    email: z
        .string()
        .email("Email inválido")
        .or(z.literal(''))
        .optional(),
    personaContacto: z.string().optional(),
    ruc: z.string()
        .min(13, "El RUC es requerido")
        .refine(val => /^\d+$/.test(val), {
            message: "El RUC debe contener solo números"
        }),
    direccion: z.string().optional(),
    estado: z.boolean(),
})

type FormValues = z.infer<typeof proveedorSchema>

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingProveedor: CreateProveedorRequest | null;
    onSubmit: (data: FormValues) => void;
}

export const ProveedorDialog = ({ open, onOpenChange, editingProveedor, onSubmit }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(proveedorSchema),
        defaultValues: {
            idProveedor: undefined,
            nombreProveedor: "",
            paisOrigen: "",
            tipoProveedor: "",
            telefono: "",
            email: "",
            personaContacto: "",
            ruc: "",
            direccion: "",
            estado: true
        }
    })

    const selectedTipo = watch("tipoProveedor");
    const isActive = watch("estado");

    useEffect(() => {
        if (open && editingProveedor) {
            setValue("idProveedor", editingProveedor.idProveedor);
            setValue("nombreProveedor", editingProveedor.nombreProveedor);
            setValue("paisOrigen", editingProveedor.paisOrigen);
            setValue("tipoProveedor", editingProveedor.tipoProveedor);
            setValue("telefono", editingProveedor.telefono);
            setValue("email", editingProveedor.email);
            setValue("personaContacto", editingProveedor.personaContacto);
            setValue("ruc", editingProveedor.ruc);
            setValue("direccion", editingProveedor.direccion);
            setValue("estado", editingProveedor.estado);
        } else if (!open) {
            reset();
        }
    }, [open, editingProveedor, setValue, reset])

    const handleFormSubmit = handleSubmit((data) => {
        const formattedData = {
            ...data,
            fechaRegistro: editingProveedor?.fechaRegistro || new Date()
        };
        onSubmit(formattedData);
        onOpenChange(false);
    });
    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}</DialogTitle>
                    <DialogDescription>
                        {editingProveedor
                            ? "Modifica la información del proveedor"
                            : "Completa la información para registrar un nuevo proveedor"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleFormSubmit}>
                    <div className="grid gap-6 py-4">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nombreProveedor">Nombre del Proveedor *</Label>
                                <Input
                                    id="nombreProveedor"
                                    placeholder="Nombre de la empresa"
                                    {...register("nombreProveedor")}
                                />
                                {errors.nombreProveedor && (
                                    <p className="text-sm text-red-500">{errors.nombreProveedor.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ruc">RUC *</Label>
                                <Input
                                    id="ruc"
                                    type="text"
                                    placeholder="20123456789"
                                    maxLength={13} // Para evitar que se escriban más de 13 caracteres
                                    {...register("ruc", {
                                        required: "El RUC es obligatorio",
                                        pattern: {
                                            value: /^\d+$/,
                                            message: "Solo se permiten números",
                                        },
                                        minLength: {
                                            value: 1,
                                            message: "Mínimo 1 dígito",
                                        },
                                        maxLength: {
                                            value: 13,
                                            message: "Máximo 13 dígitos",
                                        },
                                    })}
                                    onKeyDown={(e) => {
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== "Backspace" &&
                                            e.key !== "Delete" &&
                                            e.key !== "ArrowLeft" &&
                                            e.key !== "ArrowRight" &&
                                            e.key !== "Tab"
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {errors.ruc && (
                                    <p className="text-sm text-red-500">{errors.ruc.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="tipoProveedor">Tipo de Proveedor *</Label>
                                <Select
                                    value={selectedTipo}
                                    onValueChange={(value) => setValue("tipoProveedor", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecciona el tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            tiposProveedor.map((tipo) => (
                                                <SelectItem
                                                    key={tipo.value} value={tipo.value}
                                                >
                                                    {tipo.label}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                {errors.tipoProveedor && (
                                    <p className="text-sm text-red-500">{errors.tipoProveedor.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="paisOrigen">País de Origen *</Label>
                                <Input
                                    id="paisOrigen"
                                    placeholder="Ecuador"
                                    {...register("paisOrigen")}
                                />
                                {errors.paisOrigen && (
                                    <p className="text-sm text-red-500">{errors.paisOrigen.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Información de contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    type="text"
                                    placeholder="+51123456789"
                                    maxLength={16}
                                    {...register("telefono", {
                                        required: "El teléfono es obligatorio",
                                        pattern: {
                                            value: /^\+?\d*$/, // + opcional al inicio, luego sólo dígitos
                                            message: "Solo números y un + al inicio",
                                        },
                                    })}
                                    onKeyDown={(e) => {
                                        const allowedKeys = [
                                            "Backspace",
                                            "Delete",
                                            "ArrowLeft",
                                            "ArrowRight",
                                            "Tab",
                                        ];
                                        if (
                                            !/[0-9]/.test(e.key) &&
                                            e.key !== "+" &&
                                            !allowedKeys.includes(e.key)
                                        ) {
                                            e.preventDefault();
                                        }
                                        if (e.key === "+" && e.currentTarget.selectionStart !== 0) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {errors.telefono && (
                                    <p className="text-sm text-red-500">{errors.telefono.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="contacto@proveedor.com"
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="personaContacto">Persona de Contacto</Label>
                            <Input
                                id="personaContacto"
                                placeholder="Nombre del contacto principal"
                                {...register("personaContacto")}
                            />
                            {errors.personaContacto && (
                                <p className="text-sm text-red-500">{errors.personaContacto.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Textarea
                                id="direccion"
                                placeholder="Dirección completa del proveedor"
                                rows={3}
                                {...register("direccion")}
                            />
                            {errors.direccion && (
                                <p className="text-sm text-red-500">{errors.direccion.message}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="estado"
                                checked={isActive}
                                onCheckedChange={(checked) => setValue("estado", checked)}
                            />
                            <Label htmlFor="estado">Proveedor activo</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingProveedor ? "Actualizar" : "Crear"} Proveedor
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
