export interface BestsellerItem {
  productId: string;
  name: string;
  description: string;
  categoryId: string;
  count: number;
  price: number;
  sales: number;
  category?: Category
  images?: Image[],
  orderProductItems?: OrderProductItem[]
}

export interface BestsellerImage {
  path: string;
  _id: string;
}

export interface Product {
  productId: string;
  name?: string | null;
  description?: string | null;
  categoryId?: string | null;
  count?: number | null;
  price?: number | null;
  sales?: number | null;
  category?: Category | null;
  images: Image[];
}

export interface CartProduct
  extends Omit<
    Product,
    "description" | "categoryId" | "sales" | "category" | "images"
  > {
  image: Image;
  quantity: number;
}

export interface Category {
  categoryId: string;
  name?: string | null;
  description?: string | null;
  image?: string | null;
  products: Product[];
}

export interface Image {
  imageId: string;
  productId?: string | null;
  imageUrl?: string | null;
}

export interface Order {
  orderId: string;
  userId?: string | null;
  isPaid?: number | null;
  isDelivered?: number | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Review {
  reviewId: string;
  comment?: string | null;
  rating?: number | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface User {
  userId: string;
  name: string;
  lastName?: string;
  email?: string;
  password?: string;
  isAdmin?: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  address?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  state?: string;
  zipCode?: string;
}

export type UserAddress = Pick<User, 'address' | 'city' | 'country' | 'zipCode' | 'state' | 'phoneNumber'>;

export interface StoredUserInfo {
    _id: string;
    name: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    doNotLogout: boolean;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface orderDataDTO {
    orderItems: OrderProduct[];
    paymentMethod: string;
}

export interface LoggedInOrRegisteredUserResponse {
  success: string;
  userLoggedIn: StoredUserInfo;
  token: string;
}

export interface OrderProductItem {
  orderId?: string;
  productId?: string;
  quantity?: number;
  price?: number;
  name?: string;
  images?: Image[];
  orderProductItemId: string;
  product?: Product;
  paymentMethod?: string;
  orderTotal?: number;
  itemCount?: number;
}

export interface OrderWithProductItems {
  orderId: string;
  userId?: string;
  isPaid?: number;
  isDelivered?: number;
  createdAt?: Date;
  updatedAt?: Date;
  paymentMethod?: string;
  orderTotal?: number;
  itemCount?: number;
  paidAt?: Date;
  deliveredAt?: Date;
  orderProductItems: OrderProductItem[];
}
