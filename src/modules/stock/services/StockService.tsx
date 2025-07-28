import carfaithApi from "@/core/api/carfaithApi";
import type { ListStock } from "../types/StockType";

export const getStock = async () => {
    try {
        const response = await carfaithApi.get<ListStock[]>('/Stock/ListarInfoStock');
        return response.data;
    } catch (error) {
        console.error("Error Listando el Stock: ", error);
        throw error;
    }
}