import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/MainLayout'
import EstablishmentForm from './EstablishmentForm'
import { api } from '../../../services/api'
import type { EstablishmentFormValues } from '../../../types/establishment'
import { getErrorMessage } from '../../../utils/establishments'
import { getRole, isAdminRole } from '../../../hooks/auth'

const initialValues: EstablishmentFormValues = {
  name: '',
  description: '',
  minimumOrder: '',
  phone: '',
  category: '',
  city: '',
  deliveryAreas: '',
  mon: '9:00 — 22:00',
  tue: 'Day off',
  wed: '9:00 — 22:00',
  thu: '9:00 — 22:00',
  fri: '9:00 — 22:00',
  sat: '9:00 — 22:00',
  sun: '9:00 — 22:00',
}

export default function AddEstablishmentPage() {
  const navigate = useNavigate()
  const [values, setValues] = useState<EstablishmentFormValues>(initialValues)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const role = getRole()

    if (!isAdminRole(role)) {
      navigate('/home', { replace: true })
    }
  }, [navigate])

  const handleChange = (field: keyof EstablishmentFormValues, value: string) => {
    setValues((prev: EstablishmentFormValues) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAdd = async () => {
    setError('')

    const title = values.name.trim()
    const description = values.description.trim()
    const minOrderAmount = Number(values.minimumOrder) || 0
    const phone = values.phone.trim()
    const category = values.category.trim()
    const city = values.city.trim()
    const deliveryAreas = values.deliveryAreas.trim()

    if (!title || !phone) {
      setError('Fill in Establishment name and Phone number')
      return
    }

    setIsSaving(true)

    try {
      await api.post('/admin/restaurants', {
        title,
        description,
        category,
        deliveryTime: values.mon || '',
        facilities: '',
        isRecommended: false,
        minOrderAmount,
        phone,
        imageUrl: '',
        address: {
          area: '',
          city,
          details: deliveryAreas,
          fullAddress: city,
          latitude: 0,
          longitude: 0,
          postcode: '',
          state: '',
          street: city,
          typeAddress: 0,
          intercomCode: '',
        },
        ownerId: 0,
      })

      navigate('/admin/establishments')
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to add establishment'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <EstablishmentForm
        title="Add new establishment"
        breadcrumbLast="Add"
        values={values}
        isSaving={isSaving}
        error={error}
        submitText="Add"
        onChange={handleChange}
        onSubmit={handleAdd}
        onCancel={() => navigate(-1)}
        onNavigateHome={() => navigate('/home')}
        onNavigateProfile={() => navigate('/profile')}
        onNavigateEstablishments={() => navigate('/admin/establishments')}
      />
    </MainLayout>
  )
}