declare class OrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    customerFullName: string;
    customerDob: string;
    customerPhone: string;
    customerNationalId?: string;
    items: OrderItemDto[];
    shippingAddress?: string;
    notes?: string;
}
export {};
