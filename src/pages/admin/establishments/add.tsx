import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../../components/MainLayout'
import EstablishmentForm from './EstablishmentForm'
import { apiFetch } from '../../../services/api'
import type { EstablishmentFormValues } from '../../../types/establishment'
import { getErrorMessage } from '../../../utils/establishments'
import { getRole, isAdminRole } from '../../../utils/auth'

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

    if (!values.name.trim() || !values.phone.trim()) {
      setError('Fill in Establishment name and Phone number')
      return
    }

    setIsSaving(true)

    try {
      await apiFetch('/admin/restaurants', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name.trim(),
          description: values.description.trim(),
          minOrder: values.minimumOrder.trim(),
          minimumOrder: values.minimumOrder.trim(),
          phone: values.phone.trim(),
          phoneNumber: values.phone.trim(),
          category: values.category,
          city: values.city,
          deliveryAreas: values.deliveryAreas
            .split('\n')
            .map((x: string) => x.trim())
            .filter(Boolean),
          openingHours: {
            Monday: values.mon,
            Tuesday: values.tue,
            Wednesday: values.wed,
            Thursday: values.thu,
            Friday: values.fri,
            Saturday: values.sat,
            Sunday: values.sun,
          },
        }),
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