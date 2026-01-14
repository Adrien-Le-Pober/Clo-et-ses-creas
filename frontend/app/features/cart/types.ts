export interface Order {
    id: number;
    tokenValue: string;
    state: string;
    currencyCode: string;
    items: OrderItem[];
    itemsSubtotal: number;
    total: number;
}

export interface OrderItem {
    id: number;
    quantity: number;
    unitPrice: number;
    total: number;
    productName?: string;
    variantName?: string;
}