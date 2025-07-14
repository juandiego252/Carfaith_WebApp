import {
    BarChart3,
    Box,
    Building2,
    Home,
    MapPin,
    Package,
    ShoppingCart,
    TrendingUp,
    Truck,
    Users,
    Settings,
    Package2,
} from "lucide-react"

export interface MenuItem {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
}
export const menuItems: MenuItem[] = [
    { icon: Home, label: "Dashboard", href: "/", active: true },
    { icon: Package, label: "Productos", href: "/productos" },
    { icon: Building2, label: "Proveedores", href: "/proveedores" },
    { icon: ShoppingCart, label: "Órdenes de Compra", href: "/ordenes-compra" },
    { icon: Package2, label: "Órdenes de Ingreso", href: "/ordenes-ingreso" },
    { icon: Truck, label: "Órdenes de Egreso", href: "/ordenes-egreso" },
    { icon: Box, label: "Inventario", href: "/inventario" },
    { icon: TrendingUp, label: "Transferencias", href: "/transferencias" },
    { icon: MapPin, label: "Ubicaciones", href: "/ubicaciones" },
    { icon: BarChart3, label: "Reportes", href: "/reportes" },
    { icon: Users, label: "Usuarios", href: "/usuarios" },
    { icon: Settings, label: "Configuración", href: "/configuracion" },
]