import { InputField } from "../../InputField"
import type { CreateProductInput } from "../../../types/api-input"

type ProductCoreFieldsProps = {
  formData: Partial<
    Pick<
      CreateProductInput,
      | "price"
      | "stockQuantity"
      | "description"
      | "material"
      | "color"
      | "dimensionsText"
      | "weightText"
      | "careInstructions"
    >
  >
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
}

export function ProductPricingFields({ formData, onChange }: ProductCoreFieldsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          name="price"
          inputType="number"
          label="Giá tiền"
          onChange={onChange}
          isCompulsary
          value={formData.price}
        />

        <InputField
          name="stockQuantity"
          inputType="number"
          label="Số lượng tồn kho"
          onChange={onChange}
          isCompulsary
          value={formData.stockQuantity}
        />
      </div>

      <InputField
        name="description"
        label="Miêu tả"
        onChange={onChange}
        isCompulsary
        value={formData.description}
      />
    </>
  )
}

export function ProductDetailFields({ formData, onChange }: ProductCoreFieldsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          name="material"
          label="Vật liệu"
          onChange={onChange}
          isCompulsary={false}
          value={formData.material}
        />

        <InputField
          name="color"
          label="Màu sắc"
          onChange={onChange}
          isCompulsary={false}
          value={formData.color}
        />
      </div>

      <InputField
        name="dimensionsText"
        label="Kích thước"
        onChange={onChange}
        isCompulsary={false}
        value={formData.dimensionsText}
      />

      <InputField
        name="weightText"
        label="Cân nặng"
        onChange={onChange}
        isCompulsary={false}
        value={formData.weightText}
      />

      <InputField
        name="careInstructions"
        label="Hướng dẫn bảo quản"
        onChange={onChange}
        isCompulsary={false}
        value={formData.careInstructions}
      />
    </>
  )
}

export function ProductCoreFields({ formData, onChange }: ProductCoreFieldsProps) {
  return (
    <>
      <ProductPricingFields formData={formData} onChange={onChange} />
      <ProductDetailFields formData={formData} onChange={onChange} />
    </>
  )
}
