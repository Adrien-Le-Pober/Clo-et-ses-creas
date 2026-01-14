import { axiosClient } from "~/core/api/axios";
import type { Order } from "./types";

export async function createOrder(): Promise<Order> {
    const { data } = await axiosClient.post("/shop/orders");
    return data;
}

export async function fetchOrder(token: string): Promise<Order> {
    const { data } = await axiosClient.get(`/shop/orders/${token}`);
    return data;
}

export async function addItemToOrder(
    token: string,
    variant: string,
    quantity = 1
): Promise<Order> {
    const { data } = await axiosClient.post(
        `/shop/orders/${token}/items`,
        { variant, quantity }
    );
    return data;
}

export async function removeItemFromOrder(
    token: string,
    itemId: number
): Promise<Order> {
    const { data } = await axiosClient.delete(
        `/shop/orders/${token}/items/${itemId}`
    );
    return data;
}

export async function updateOrderItemQuantity(
    token: string,
    itemId: number,
    quantity: number
): Promise<Order> {
    return axiosClient.patch(
        `/shop/orders/${token}/items/${itemId}`,
        { quantity }
    ).then(res => res.data);
}