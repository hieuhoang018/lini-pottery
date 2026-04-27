export const serviceErrorMap: Record<
  string,
  { statusCode: number; message: string }
> = {
  EMAIL_ALREADY_EXISTS: {
    statusCode: 409,
    message: "Email already exists",
  },
  INVALID_CREDENTIALS: {
    statusCode: 401,
    message: "Invalid email or password",
  },
  ORDER_NOT_FOUND: {
    statusCode: 404,
    message: "Order not found",
  },
  ORDER_ALREADY_CANCELLED: {
    statusCode: 400,
    message: "Order already cancelled",
  },
  CART_EMPTY: {
    statusCode: 400,
    message: "Cart is empty",
  },
  PRODUCT_NOT_AVAILABLE: {
    statusCode: 400,
    message: "Product is not available",
  },
  NOT_ENOUGH_STOCK: {
    statusCode: 400,
    message: "Not enough stock",
  },
  INVALID_QUANTITY: {
    statusCode: 400,
    message: "Invalid quantity",
  },
  CART_ITEM_NOT_FOUND: {
    statusCode: 404,
    message: "Cart item not found",
  },
  WISHLIST_ITEM_NOT_FOUND: {
    statusCode: 404,
    message: "Wishlist item not found",
  },
}
