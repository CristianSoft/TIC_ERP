export interface Inventory {
  id?: number;
  stateid?: number;
  product: string;
  movementType: string;
  quantity: number;
  date: string;
}

export interface Product {
  id?: number;
  stateid?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  label: string;
  provider: string;
}
