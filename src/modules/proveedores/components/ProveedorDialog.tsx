import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/core/components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const proveedorSchema = z.object({
  idProveedor: z.number().optional(),
  nombreProveedor: z.string().min(1, "El nombre del proveedor es requerido"),
  paisOrigen: z.string().min(1, "El pais de origen es requerido"),
  tipoProveedor: z.string().min(1, "Debes seleccionar un tipo de Proveedor"),
  telefono: z
    .string()
    .min(10, "El numero de telefono debe tener al menos 10 caracteres"),
  email: z.string().min(1, "El email debe cumplir el formato esperado"),
  personaContacto: z.string().min(1, "La persona de contacto es requerido"),
  ruc: z.string().min(13, "El ruc debe tener al menos 13 caracteres"),
  fechaRegistro: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
  direccion: z.string().min(2, "La direccion es requerida"),
  estado: z.number().refine((val) => val === 0 || val === 1, {
    message: "El estado debe ser 0 o 1",
  }),
});

type FormValues = z.infer<typeof proveedorSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProveedor?: {
    id?: number;
    nombreProveedor: string;
    paisOrigen: string;
    tipoProveedor: string;
    telefono: string;
    email: string;
    personaContacto: string;
    fechaRegistro: string;
    ruc: string;
    direccion: string;
    estado: number;
  } | null;
  onSubmit: (data: FormValues) => void;
}

export const ProveedorDialog = ({
  open,
  onOpenChange,
  editingProveedor,
  onSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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
      fechaRegistro: "",
      ruc: "",
      direccion: "",
      estado: 1,
    },
  });

  useEffect(() => {
    if (open && editingProveedor) {
      if (editingProveedor.id) {
        setValue("idProveedor", editingProveedor.id);
      }
      setValue("nombreProveedor", editingProveedor.nombreProveedor);
      setValue("tipoProveedor", editingProveedor.tipoProveedor);
      setValue("telefono", editingProveedor.telefono);
      setValue("email", editingProveedor.email);
      setValue("personaContacto", editingProveedor.personaContacto);
      setValue(
        "fechaRegistro",
        new Date(editingProveedor.fechaRegistro).toISOString().split("T")[0]
      );
      setValue("ruc", editingProveedor.ruc);
      setValue("direccion", editingProveedor.direccion);
      setValue("estado", editingProveedor.estado ? 1 : 0);
    } else if (!open) {
      reset();
    }
  }, [open, editingProveedor, setValue, reset]);

  const handleFormSubmit = handleSubmit((data) => {
    console.log("Recibí en el padre:", data);
    const formattedData = {
      //   idProveedor: data.idProveedor,
      nombreProveedor: data.nombreProveedor,
      paisOrigen: data.paisOrigen,
      tipoProveedor: data.tipoProveedor,
      telefono: data.telefono,
      email: data.email,
      personaContacto: data.personaContacto,
      fechaRegistro: new Date(data.fechaRegistro).toISOString().split("T")[0],
      ruc: data.ruc,
      direccion: data.direccion,
      //   estado: data.estado,
      estado: data.estado,
    };
    onSubmit(formattedData);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingProveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
          <DialogDescription>
            {editingProveedor
              ? "Modifica la información del proveedor"
              : "Completa la información para crear un nuevo proveedor"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-2 gap-6 py-4">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="nombreProveedor">Nombre del Proveedor</Label>
                <Input
                  id="nombreProveedor"
                  placeholder="Julio Jaramillo"
                  {...register("nombreProveedor")}
                />
                {errors.nombreProveedor && (
                  <p className="text-sm text-red-500">
                    {errors.nombreProveedor.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipoProveedor">Tipo de Proveedor</Label>
                <Input
                  id="tipoProveedor"
                  placeholder="Local / Importado"
                  {...register("tipoProveedor")}
                />
                {errors.tipoProveedor && (
                  <p className="text-sm text-red-500">
                    {errors.tipoProveedor.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="email@proveedor.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  placeholder="1234567890001"
                  {...register("ruc")}
                />
                {errors.ruc && (
                  <p className="text-sm text-red-500">{errors.ruc.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Estado</Label>
                <div>
                  <label>
                    <input
                      type="radio"
                      value="1"
                      {...register("estado", {
                        setValueAs: (v) => v === 1,
                      })}
                    />
                    Activo
                  </label>

                  <label className="ml-4">
                    <input
                      type="radio"
                      value="0"
                      {...register("estado", {
                        setValueAs: (v) => v === 0,
                      })}
                    />
                    Inactivo
                  </label>
                </div>
                {errors.estado && (
                  <p className="text-sm text-red-500">
                    {errors.estado.message}
                  </p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="paisOrigen">País de Origen</Label>
                <Input
                  id="paisOrigen"
                  placeholder="Ecuador"
                  {...register("paisOrigen")}
                />
                {errors.paisOrigen && (
                  <p className="text-sm text-red-500">
                    {errors.paisOrigen.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  placeholder="0999999999"
                  {...register("telefono")}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500">
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="personaContacto">Persona de Contacto</Label>
                <Input
                  id="personaContacto"
                  placeholder="Juan Pérez"
                  {...register("personaContacto")}
                />
                {errors.personaContacto && (
                  <p className="text-sm text-red-500">
                    {errors.personaContacto.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  placeholder="Av. Siempre Viva 123"
                  {...register("direccion")}
                />
                {errors.direccion && (
                  <p className="text-sm text-red-500">
                    {errors.direccion.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingProveedor ? "Actualizar" : "Crear"} Proveedor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
