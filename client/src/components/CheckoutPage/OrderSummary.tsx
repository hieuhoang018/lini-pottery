import { useCart } from "../../contexts/CartContext"

export function OrderSummary() {
  const { items, total } = useCart()
  
  return (
    <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>

      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const image =
            item.product.featuredImageUrl ||
            item.product.images[0]?.imageUrl ||
            "/placeholder.png"

          return (
            <div key={item.product.id} className="flex gap-3">
              <img
                src={image}
                alt={item.product.name}
                className="h-16 w-16 rounded-xl bg-stone-200 object-cover"
              />

              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-stone-500">
                  Số lượng: {item.quantity}
                </p>
              </div>

              <p className="font-medium">
                {(Number(item.product.price) * item.quantity).toFixed()}đ
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-6 border-t border-stone-200 pt-5">
        <div className="flex justify-between text-stone-600">
          <span>Thành tiền</span>
          <span>{total.toFixed()}đ</span>
        </div>

        <div className="mt-2 flex justify-between text-stone-600">
          <span>Giao hàng</span>
          <span>0đ</span>
        </div>

        <div className="mt-4 flex justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span>{total.toFixed()}đ</span>
        </div>
      </div>
    </aside>
  )
}
