/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { asociateProductoProveedor, deleteProductoProveedor, editProductoProveedor } from '../services/AsociarService';
import type { ProductoList } from '@/modules/productos/types/ProductoType';
import type { ListProveedores } from '@/modules/proveedores/types/ProveedorType';
import type { ProductoProveedorRequest, ProductoProveedorDetalles } from '../types/ProductoProveedorTypes';

export const useProductoProveedorActions = (
    productos: ProductoList[],
    proveedores: ListProveedores[],
    reloadAsociaciones: () => Promise<any>
) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isMassiveDialogOpen, setIsMassiveDialogOpen] = useState(false);
    const [editingAsociacion, setEditingAsociacion] = useState<ProductoProveedorRequest | null>(null);

    const handleCreateAsociacion = () => {
        setEditingAsociacion(null);
        setIsCreateDialogOpen(true);
    };

    const handleEditAsociacion = (asociacion: ProductoProveedorDetalles) => {
        const idProducto = productos.find(p => p.nombreProducto === asociacion.nombreProducto)?.idProducto || 0;
        const idProveedor = proveedores.find(p => p.nombreProveedor === asociacion.nombreProveedor)?.idProveedor || 0;

        const editData = {
            idProductoProveedor: asociacion.idProductoProveedor,
            idProducto: idProducto,
            idProveedor: idProveedor
        };

        setEditingAsociacion(editData);
        setIsCreateDialogOpen(true);
    };

    const handleSubmitAsociacion = async (data: ProductoProveedorRequest) => {
        try {
            // Si es edición (tiene idProductoProveedor)
            if (editingAsociacion?.idProductoProveedor) {
                await editProductoProveedor(
                    editingAsociacion.idProductoProveedor,
                    data.idProducto,
                    data.idProveedor
                );
            } else {
                // Si es creación
                await asociateProductoProveedor(data.idProducto, data.idProveedor);
            }
            await reloadAsociaciones();
            setIsCreateDialogOpen(false);
        } catch (error) {
            console.error("Error al guardar asociación:", error);
        }
    };

    const handleMassiveAssociationSuccess = async () => {
        try {
            await reloadAsociaciones();
        } catch (error) {
            console.error("Error reloading associations after massive association:", error);
        }
    };

    const handleOpenMassiveDialog = () => {
        setIsMassiveDialogOpen(true);
    };

    const handleDeleteAsociacion = async (idProductoProveedor: number) => {
        try {
            await deleteProductoProveedor(idProductoProveedor);
            await reloadAsociaciones();
        } catch (error) {
            console.error("Error deleting association:", error);
        }
    }

    return {
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isMassiveDialogOpen,
        setIsMassiveDialogOpen,
        editingAsociacion,
        handleCreateAsociacion,
        handleEditAsociacion,
        handleSubmitAsociacion,
        handleMassiveAssociationSuccess,
        handleOpenMassiveDialog,
        handleDeleteAsociacion
    };
};