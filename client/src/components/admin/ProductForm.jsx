import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productFormSchema } from '../../utils/validators'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'

const ProductForm = ({ initialData, categories, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      stockQty: 0,
      isSeasonal: false,
      availableFrom: '',
      availableUntil: '',
      images: [],
    },
  })

  const categoryOptions = categories?.map((c) => ({
    value: c.id,
    label: c.name,
  })) || []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Product Name"
          placeholder="Crimson Rose Bouquet"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <Select
          label="Category"
          placeholder="Select Category"
          options={categoryOptions}
          required
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          rows={4}
          placeholder="Describe the flower arrangement..."
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Input
          label="Price (₹)"
          type="number"
          placeholder="999"
          required
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />

        <Input
          label="Stock Quantity"
          type="number"
          placeholder="50"
          required
          error={errors.stockQty?.message}
          {...register('stockQty', { valueAsNumber: true })}
        />
      </div>

      {/* Seasonal options */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            {...register('isSeasonal')}
          />
          <span className="text-sm font-medium text-gray-700">
            This is a seasonal product
          </span>
        </label>

        {initialData?.isSeasonal && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Available From"
              type="date"
              error={errors.availableFrom?.message}
              {...register('availableFrom')}
            />
            <Input
              label="Available Until"
              type="date"
              error={errors.availableUntil?.message}
              {...register('availableUntil')}
            />
          </div>
        )}
      </div>

      {/* Image upload placeholder */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Images
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop images here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG up to 5MB (max 5 images)
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} className="flex-1">
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  )
}

export default ProductForm
