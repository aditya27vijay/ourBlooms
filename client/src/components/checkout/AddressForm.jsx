import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema } from '../../utils/validators'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'

const AddressForm = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData || {
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      isDefault: false,
    },
  })

  const states = [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Arunachal Pradesh', label: 'Arunachal Pradesh' },
    { value: 'Assam', label: 'Assam' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Chhattisgarh', label: 'Chhattisgarh' },
    { value: 'Goa', label: 'Goa' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Haryana', label: 'Haryana' },
    { value: 'Himachal Pradesh', label: 'Himachal Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Manipur', label: 'Manipur' },
    { value: 'Meghalaya', label: 'Meghalaya' },
    { value: 'Mizoram', label: 'Mizoram' },
    { value: 'Nagaland', label: 'Nagaland' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Punjab', label: 'Punjab' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Sikkim', label: 'Sikkim' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Tripura', label: 'Tripura' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Uttarakhand', label: 'Uttarakhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Delhi', label: 'Delhi' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        placeholder="John Doe"
        required
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Phone Number"
        placeholder="9876543210"
        required
        error={errors.phone?.message}
        {...register('phone')}
      />

      <Input
        label="Address Line 1"
        placeholder="House/Flat No., Building Name"
        required
        error={errors.addressLine1?.message}
        {...register('addressLine1')}
      />

      <Input
        label="Address Line 2"
        placeholder="Street, Area, Locality (Optional)"
        error={errors.addressLine2?.message}
        {...register('addressLine2')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="Mumbai"
          required
          error={errors.city?.message}
          {...register('city')}
        />
        <Select
          label="State"
          placeholder="Select State"
          options={states}
          required
          error={errors.state?.message}
          {...register('state')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Pincode"
          placeholder="400001"
          required
          error={errors.pincode?.message}
          {...register('pincode')}
        />
        <Input
          label="Landmark"
          placeholder="Near City Hospital (Optional)"
          error={errors.landmark?.message}
          {...register('landmark')}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          {...register('isDefault')}
        />
        <span className="text-sm text-gray-700">Save as default address</span>
      </label>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" loading={isLoading} className="flex-1">
          {initialData ? 'Update Address' : 'Save Address'}
        </Button>
      </div>
    </form>
  )
}

export default AddressForm
