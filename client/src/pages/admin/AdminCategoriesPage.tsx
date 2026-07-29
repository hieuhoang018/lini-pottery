import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/categoryApi"
import type { Category } from "../../types/category"
import { useApiFetch } from "../../hooks/useApiFetch"
import { useForm } from "../../hooks/useForm"
import type { CreateCategoryInput } from "../../types/api-input"
import { AdminCategoriesSkeleton } from "../../components/skeletons/AdminCategoriesPage"
import { getErrorMessage } from "../../utils/getErrorMessage"

const initialCreateCategoryForm: CreateCategoryInput = {
  name: "",
}

export function AdminCategoriesPage() {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  )
  const [editingName, setEditingName] = useState("")
  const [saving, setSaving] = useState(false)

  const {
    data: categories,
    loading,
    refetch,
  } = useApiFetch<Category[]>(() => getCategories(), [])

  const {
    formData: createCategoryFormData,
    loading: loadingCategoryCreate,
    error: createCategoryError,
    handleChange: handleCreateCategoryChange,
    handleSubmit: handleCreateCategorySubmit,
  } = useForm<CreateCategoryInput>({
    initialData: initialCreateCategoryForm,
    onSubmit: async (data) => {
      await createCategory({
        name: data.name.trim(),
      })

      toast.success("Đã thêm phân loại")
      await refetch()
    },
  })

  useEffect(() => {
    if (createCategoryError) {
      toast.error(createCategoryError)
    }
  }, [createCategoryError])

  const startEdit = (category: Category) => {
    setEditingCategoryId(category.id)
    setEditingName(category.name)
  }

  const cancelEdit = () => {
    setEditingCategoryId(null)
    setEditingName("")
  }

  const handleUpdateCategory = async (id: string) => {
    if (!editingName.trim()) {
      toast.error("Tên phân loại không được để trống")
      return
    }

    try {
      setSaving(true)

      await updateCategory(id, {
        name: editingName.trim(),
      })

      toast.success("Đã cập nhật phân loại")
      cancelEdit()
      await refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể cập nhật phân loại"))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa phân loại này không?",
    )

    if (!confirmed) return

    try {
      setSaving(true)

      await deleteCategory(id)

      toast.success("Đã xóa phân loại")
      await refetch()
    } catch (err) {
      toast.error(getErrorMessage(err, "Không thể xóa phân loại"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <AdminCategoriesSkeleton />
  }

  if (!categories) {
    return <p>Lỗi khi tải phân loại</p>
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-2xl font-bold">Quản lý phân loại</h2>

      <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
        <p className="text-sm font-medium text-stone-700">Thêm phân loại mới</p>
        <form onSubmit={handleCreateCategorySubmit}>
          <div className="mt-3 flex gap-2">
            <input
              value={createCategoryFormData.name}
              name="name"
              onChange={handleCreateCategoryChange}
              placeholder="Tên phân loại"
              className="flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm"
            />

            <button
              disabled={loadingCategoryCreate}
              className="rounded-xl bg-amber-800 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-900 disabled:bg-stone-300"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {categories.map((category) => {
          const isEditing = editingCategoryId === category.id

          return (
            <div
              key={category.id}
              className="rounded-xl border border-stone-200 p-4"
            >
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    className="flex-1 rounded-xl border border-stone-300 px-4 py-3 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => handleUpdateCategory(category.id)}
                    disabled={saving}
                    className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white disabled:bg-stone-300"
                  >
                    Lưu
                  </button>

                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-stone-900">
                      {category.name}
                    </p>
                    <p className="text-sm text-stone-500">/{category.slug}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold"
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={saving}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-stone-300"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
