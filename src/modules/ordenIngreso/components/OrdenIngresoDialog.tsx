/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/core/components'
import type { ListOrdenCompras } from '@/modules/ordenCompra/types/OrdenComprasType';
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Plus, Package2, X } from 'lucide-react'
import type { CreateOrdenIngresoDetalleRequest, Detalle, ListUbicaciones } from '../types/OrdenIngresoTypes';
import { useEffect, useState } from 'react';
import type { ProductoProveedorDetalles } from '@/modules/asociarPP/types/ProductoProveedorTypes';

interface DetalleOrden {
    id: number;
    codigo: string;
    producto: string;
    cantidad: number;
    precioUnitario: number;
    ubicacion: string;
    tipoIngreso: "por_cantidad" | "por_lote";
    numeroLote?: string | null;
}

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

    const [idOrdenCompra, setIdOrdenCompra] = useState<string>("");
    const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
    const [origen, setOrigen] = useState<string>("");
    const [estado, setEstado] = useState<string>("pendiente");
    const [detallesOrden, setDetallesOrden] = useState<DetalleOrden[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Resetear el formulario cuando se abre el diálogo (enfoque en crear)
    useEffect(() => {
        if (open && !editingOrden) {
            // Resetear a valores predeterminados para crear
            setIdOrdenCompra("");
            setFecha(new Date().toISOString().split('T')[0]);
            setOrigen("");
            setEstado("pendiente");
            setDetallesOrden([]);
        }
    }, [open, editingOrden]);

    // Funciones para manejar los detalles de la orden
    const addDetalleOrden = () => {
        const nuevoDetalle: DetalleOrden = {
            id: Date.now(), // ID temporal para manipulación en el front
            codigo: "",
            producto: "",
            cantidad: 1,
            precioUnitario: 0,
            ubicacion: "",
            tipoIngreso: "por_cantidad",
            numeroLote: null
        };
        setDetallesOrden([...detallesOrden, nuevoDetalle]);
    };

    const removeDetalleOrden = (id: number) => {
        setDetallesOrden(detallesOrden.filter(detalle => detalle.id !== id));
    };

    const updateDetalleOrden = (id: number, field: keyof DetalleOrden, value: any) => {
        setDetallesOrden(detallesOrden.map(detalle => {
            if (detalle.id === id) {
                return { ...detalle, [field]: value };
            }
            return detalle;
        }));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            const formattedDetalles: Detalle[] = detallesOrden.map(detalle => ({
                idProductoProveedor: detalle.id,
                cantidad: detalle.cantidad,
                precioUnitario: detalle.precioUnitario,
                ubicacionId: Number(detalle.ubicacion),
                tipoIngreso: detalle.tipoIngreso,
                numeroLote: detalle.numeroLote || ""
            }));

            const formData: CreateOrdenIngresoDetalleRequest = {
                idOrdenCompra: Number(idOrdenCompra),
                origenDeCompra: origen,
                fecha: new Date(fecha),
                estado: estado,
                detalles: formattedDetalles
            };
            // Enviar datos al servidor
            await onSubmit(formData);
            onOpenChange(false); // Cerrar diálogo después de enviar
        } catch (error) {
            console.error("Error al crear orden de ingreso:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        < Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingOrden ? "Editar Orden de Ingreso" : "Nueva Orden de Ingreso"}</DialogTitle>
                    <DialogDescription>
                        {editingOrden
                            ? "Modifica la información de la orden de ingreso"
                            : "Completa la información para crear una nueva orden de ingreso"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-8 py-4">
                    {/* Información general */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="ordenCompra">Orden de Compra *</Label>
                            <Select
                                value={idOrdenCompra}
                                onValueChange={setIdOrdenCompra}
                            >
                                <SelectTrigger className="w-full min-w-0">
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
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="fecha">Fecha de Ingreso *</Label>
                            <Input
                                id="fecha"
                                type="date"
                                className="w-full min-w-0"
                                defaultValue={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="origen">Origen de Compra *</Label>
                            <Select
                                value={origen}
                                onValueChange={setOrigen}
                            >
                                <SelectTrigger className="w-full min-w-0">
                                    <SelectValue placeholder="Selecciona origen" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* {.map((origen) => (
                                        <SelectItem key={origen.value} value={origen.value}>
                                            {origen.label}
                                        </SelectItem>
                                    ))} */}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="estado">Estado *</Label>
                        <Select defaultValue={editingOrden?.estado || "pendiente"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona estado" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* {estadosIngreso.map((estado) => (
                                    <SelectItem key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </SelectItem>
                                ))} */}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {/* Detalles de la orden */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Detalles de la Orden</h3>
                            <Button type="button" variant="outline" onClick={addDetalleOrden}>
                                <Plus className="mr-2 h-4 w-4" />
                                Agregar Producto
                            </Button>
                        </div>

                        {detallesOrden.length === 0 ? (
                            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                <Package2 className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
                                <p className="mt-1 text-sm text-gray-500">Agrega productos a esta orden de ingreso</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {detallesOrden.map((detalle, index) => (
                                    <Card key={detalle.id} className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="font-medium">Producto {index + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeDetalleOrden(detalle.id)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Producto *</Label>
                                                <Select
                                                    value={detalle.id.toString()}
                                                    onValueChange={(value) => {
                                                        const productoId = Number(value);
                                                        const producto = asociaciones.find((p) => p.idProductoProveedor === productoId);
                                                        updateDetalleOrden(detalle.id, "id", productoId);
                                                        updateDetalleOrden(detalle.id, "codigo", producto?.codigoProducto || "");
                                                        updateDetalleOrden(detalle.id, "producto", producto?.nombreProducto || "");
                                                    }}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona producto" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {asociaciones.map((producto) => (
                                                            <SelectItem key={producto.idProductoProveedor} value={producto.idProductoProveedor.toString()}>
                                                                {producto.codigoProducto} - {producto.nombreProducto}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Cantidad *</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={detalle.cantidad}
                                                    onChange={(e) =>
                                                        updateDetalleOrden(detalle.id, "cantidad", Number.parseInt(e.target.value))
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Precio Unitario *</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={detalle.precioUnitario}
                                                    onChange={(e) =>
                                                        updateDetalleOrden(detalle.id, "precioUnitario", Number.parseFloat(e.target.value))
                                                    }
                                                />
                                            </div>

                                            <div className="grid gap-2">
                                                <Label>Ubicación *</Label>
                                                <Select
                                                    value={detalle.ubicacion}
                                                    onValueChange={(value) => updateDetalleOrden(detalle.id, "ubicacion", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona ubicación" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ubicaciones.map((ubicacion) => (
                                                            <SelectItem key={ubicacion.idUbicacion} value={ubicacion.lugarUbicacion}>
                                                                {ubicacion.lugarUbicacion}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="grid gap-2">
                                                <Label>Tipo de Ingreso *</Label>
                                                <Select
                                                    value={detalle.tipoIngreso}
                                                    onValueChange={(value) => updateDetalleOrden(detalle.id, "tipoIngreso", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="por_cantidad">Por Cantidad</SelectItem>
                                                        <SelectItem value="por_lote">Por Lote</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {detalle.tipoIngreso === "por_lote" && (
                                                <div className="grid gap-2">
                                                    <Label>Número de Lote</Label>
                                                    <Input
                                                        placeholder="LOT-2024-001"
                                                        value={detalle.numeroLote || ""}
                                                        onChange={(e) => updateDetalleOrden(detalle.id, "numeroLote", e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm font-medium">
                                                Subtotal: ${(detalle.cantidad * detalle.precioUnitario).toLocaleString()}
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                <div className="flex justify-end">
                                    <div className="text-lg font-bold">
                                        Total: $
                                        {detallesOrden
                                            .reduce((sum, detalle) => sum + detalle.cantidad * detalle.precioUnitario, 0)
                                            .toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Guardando..."
                            : editingOrden ? "Actualizar" : "Crear"} Orden
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
