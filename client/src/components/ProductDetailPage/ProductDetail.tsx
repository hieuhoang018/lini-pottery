import type { Product } from "../../types/product"

export function ProductDetail({ product }: { product: Product }) {
  const isOutOfStock = product.stockQuantity <= 0
  return (
    <>
      <p className="text-sm font-semibold text-amber-800">
        {product.category.name}
      </p>

      <h1 className="mt-3 text-4xl font-bold">{product.name}</h1>

      <p className="mt-4 text-2xl font-semibold">{product.price}đ</p>

      <p className={isOutOfStock ? "mt-3 text-red-600" : "mt-3 text-green-700"}>
        {isOutOfStock ? "Hết hàng" : `${product.stockQuantity} món còn lại`}
      </p>

      <p className="mt-6 leading-7 text-stone-700">{product.description}</p>

      <div className="mt-8 space-y-3 rounded-2xl bg-white p-5 ring-1 ring-stone-200">
        {product.material && (
          <p>
            <span className="font-semibold">Vật liệu:</span> {product.material}
          </p>
        )}
        {product.color && (
          <p>
            <span className="font-semibold">Màu:</span> {product.color}
          </p>
        )}
        {product.dimensionsText && (
          <p>
            <span className="font-semibold">Kích thước:</span>{" "}
            {product.dimensionsText}
          </p>
        )}
        {product.weightText && (
          <p>
            <span className="font-semibold">Cân nặng:</span>{" "}
            {product.weightText}
          </p>
        )}
        {product.careInstructions && (
          <p>
            <span className="font-semibold">Cách bảo quản:</span>{" "}
            {product.careInstructions}
          </p>
        )}
      </div>
    </>
  )
}
