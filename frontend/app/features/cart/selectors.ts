import type { Order } from "./types";

export const selectTotalQuantity = (order?: Order) =>
    order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

export const selectItemsSubtotal = (order?: Order) =>
    order?.itemsSubtotal ?? 0;

export const selectTotal = (order?: Order) =>
    order?.total ?? 0;