import { Button, Checkbox, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components"
import type { ProductoList } from "@/modules/productos/types/ProductoType";
import type { ListProveedores } from "@/modules/proveedores/types/ProveedorType";
import { useEffect, useState } from "react";
import type { MassiveAsociationRequest } from "../types/ProductoProveedorTypes";
import { massiveAssociation } from "../services/AsociarService";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productos: ProductoList[];
    proveedores: ListProveedores[];
    onSuccess: () => void;
}


export const AsociasionMasivaDialog = ({ productos, proveedores, onOpenChange, open, onSuccess }: Props) => {
    const [selectedProducto, setSelectedProducto] = useState<string>("");
    const [selectedProveedores, setSelectedProveedores] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Resetear estados cuando se cierra el diálogo
    useEffect(() => {
        if (!open) {
            setSelectedProducto("");
            setSelectedProveedores([]);
        }
    }, [open]);

    const toggleProveedorSelection = (proveedorId: number) => {
        setSelectedProveedores(prev => {
            if (prev.includes(proveedorId)) {
                return prev.filter(id => id !== proveedorId);
            } else {
                return [...prev, proveedorId];
            }
        });
    };

    // Seleccionar todos los proveedores
    const selectAllProveedores = () => {
        const availableProveedores = proveedores.filter(p => p.estado).map(p => p.idProveedor);
        setSelectedProveedores(availableProveedores);
    };

    // Deseleccionar todos los proveedores
    const deselectAllProveedores = () => {
        setSelectedProveedores([]);
    };

    // Manejar el envío del formulario
    const handleSubmit = async () => {
        if (!selectedProducto || selectedProveedores.length === 0) {
            return;
        }
        setIsSubmitting(true);
        try {
            const data: MassiveAsociationRequest = {
                idProducto: parseInt(selectedProducto),
                idsProveedores: selectedProveedores
            };

            await massiveAssociation(data);
            onOpenChange(false);
            onSuccess(); // Recargar datos en la página principal
        } catch (error) {
            console.error("Error en asociación masiva:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Obtener nombre del producto seleccionado
    const getSelectedProductName = () => {
        const producto = productos.find(p => p.idProducto.toString() === selectedProducto);
        return producto ? `${producto.codigoProducto} - ${producto.nombreProducto}` : "";
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Asociación Masiva</DialogTitle>
                    <DialogDescription>Asocia un producto con múltiples proveedores de una vez</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="productoMasivo">Producto *</Label>
                        <Select value={selectedProducto} onValueChange={setSelectedProducto}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un producto" />
                            </SelectTrigger>
                            <SelectContent>
                                {productos.map((producto) => (
                                    <SelectItem key={producto.idProducto} value={producto.idProducto.toString()}>
                                        {producto.codigoProducto} - {producto.nombreProducto}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedProducto && (
                        <>
                            <div className="bg-blue-50 p-3 rounded-md">
                                <div className="font-medium">Producto seleccionado:</div>
                                <div className="text-sm">{getSelectedProductName()}</div>
                            </div>

                            <div className="flex justify-between items-center">
                                <Label>Proveedores Disponibles ({proveedores.filter(p => p.estado).length})</Label>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={selectAllProveedores}
                                    >
                                        Seleccionar todos
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={deselectAllProveedores}
                                        disabled={selectedProveedores.length === 0}
                                    >
                                        Deseleccionar todos
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-4">
                        <div className="grid gap-3 max-h-60 overflow-y-auto">
                            {proveedores
                                .filter((p) => p.estado)
                                .map((proveedor) => (
                                    <div key={proveedor.idProveedor} className="flex items-center space-x-3 p-3 border rounded-lg">
                                        <Checkbox
                                            id={`proveedor-${proveedor.idProveedor}`}
                                            checked={selectedProveedores.includes(proveedor.idProveedor)}
                                            onCheckedChange={() => toggleProveedorSelection(proveedor.idProveedor)}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{proveedor.nombreProveedor}</span>
                                                <span className="text-xs text-gray-500">{proveedor.tipoProveedor}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">{proveedor.paisOrigen}</div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {selectedProveedores.length > 0 && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="text-sm font-medium text-blue-800">
                                {selectedProveedores.length} proveedor(es) seleccionado(s)
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                                Se crearán {selectedProveedores.length} asociaciones nuevas
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedProducto || selectedProveedores.length === 0 || isSubmitting}
                    >
                        {isSubmitting
                            ? "Creando asociaciones..."
                            : `Crear ${selectedProveedores.length} Asociaciones`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
