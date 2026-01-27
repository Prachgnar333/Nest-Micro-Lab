// Shared DTOs for orders

export interface CreateOrderDto {
  userId: string;
  items: OrderItem[];
  total: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderDto {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
  status: "pending" | "completed" | "cancelled";
}

export interface ListOrdersResponseDto {
  orders: OrderDto[];
  total: number;
}
