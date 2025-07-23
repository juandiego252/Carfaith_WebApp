import { useState, useMemo } from 'react';
import type { ProductoProveedorDetalles } from '../types/ProductoProveedorTypes';

export const useProductoProveedorFilter = (asociaciones: ProductoProveedorDetalles[]) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTipo, setSelectedTipo] = useState("all");

    const filteredAsociaciones = useMemo(() => {
        return asociaciones.filter((asociacion) => {
            const matchesSearch =
                asociacion.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asociacion.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                asociacion.nombreProveedor.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTipo = selectedTipo === "all" || asociacion.paisOrigen === selectedTipo;

            return matchesSearch && matchesTipo;
        });
    }, [asociaciones, searchTerm, selectedTipo]);

    // Obtener todos los países únicos para el filtro
    const paisesUnicos = useMemo(() => {
        return Array.from(new Set(asociaciones.map(a => a.paisOrigen)));
    }, [asociaciones]);

    return {
        searchTerm,
        setSearchTerm,
        selectedTipo,
        setSelectedTipo,
        filteredAsociaciones,
        paisesUnicos
    };
};