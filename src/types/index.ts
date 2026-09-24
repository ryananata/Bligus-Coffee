export type ProductCategory =
  | "Signature Series"
  | "Coffee Series"
  | "Americano Series"
  | "Non-Coffee Series"
  | "BliGus Gabin"
  | "Combo / Bundling";

export type AddOn = {
  id: string;
  name: string;
  price: number;
};

export type ProductBadge = "Best Seller" | "New";

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  badge?: ProductBadge;
};

export type CartItem = {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedAddOns: AddOn[];
  unitTotalPrice: number;
};

export type OrderStatus =
  | "Menunggu Diproses"
  | "Sedang Diproses"
  | "Siap Diambil"
  | "Selesai"
  | "Dibatalkan";

export type OrderItem = {
  id: number;
  name: string;
  price: number;
  unitTotalPrice: number;
  quantity: number;
  subtotal: number;
  addOns?: string[];
};

export type Order = {
  id: string; // e.g. BLG-20260917-001
  customerName: string;
  whatsapp: string;
  notes?: string;
  items: OrderItem[];
  total: number;
  proofImage?: string; // base64 or URL of transfer proof
  status?: OrderStatus;
  createdAt: string;
};
