const tiposProveedor = [
    { value: "Nacional", label: "Nacional", color: "bg-green-100 text-green-800" },
    { value: "Internacional", label: "Internacional", color: "bg-blue-100 text-blue-800" },
    { value: "Mixto", label: "Mixto", color: "bg-purple-100 text-purple-800" }
];

export const useTipoProveedorBadge = () => {
    const getTipoProveedorBadge = (tipo: string) => {
        const tipoInfo = tiposProveedor.find((t) => t.value === tipo);
        return tipoInfo
            ? { label: tipoInfo.label, className: tipoInfo.color }
            : { label: tipo, className: "bg-gray-100 text-gray-800" };
    };

    return {
        getTipoProveedorBadge,
        tiposProveedor
    };
};