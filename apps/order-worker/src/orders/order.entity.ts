// orders/order.entity.ts
// Simple Order DTO (no database persistence for now)
export class Order {
  id: number;
  data: object;
  status: string;
  processedAt: Date;
}
