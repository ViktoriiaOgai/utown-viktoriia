import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../../components/MainLayout'
import EstablishmentForm from '../EstablishmentForm'
import { apiFetch } from '../../../../services/api'
import type { EstablishmentFormValues } from '../../../../types/establishment'
import { getErrorMessage } from '../../../../utils/establishments'

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

export default function EditEstablishmentPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [values, setValues] = useState<EstablishmentFormValues>(initialValues)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof EstablishmentFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  useEffect(() => {
    if (!id) return

    setIsLoading(true)
    setError('')

    apiFetch(`/admin/restaurants/${id}`)
      .then((data: any) => {
        const details = data?.data ?? data
        const areas = details?.deliveryAreas
        const hours = details?.openingHours ?? details?.workingHours ?? {}

        setValues({
          name: String(details?.name ?? ''),
          description: String(details?.description ?? ''),
          minimumOrder: String(details?.minOrder ?? details?.minimumOrder ?? ''),
          phone: String(details?.phone ?? details?.phoneNumber ?? ''),
          category: String(details?.category ?? ''),
          city: String(details?.city ?? ''),
          deliveryAreas: Array.isArray(areas) ? areas.join('\n') : String(areas ?? ''),
          mon: String(hours?.Monday ?? hours?.MONDAY ?? '9:00 — 22:00'),
          tue: String(hours?.Tuesday ?? hours?.TUESDAY ?? 'Day off'),
          wed: String(hours?.Wednesday ?? hours?.WEDNESDAY ?? '9:00 — 22:00'),
          thu: String(hours?.Thursday ?? hours?.THURSDAY ?? '9:00 — 22:00'),
          fri: String(hours?.Friday ?? hours?.FRIDAY ?? '9:00 — 22:00'),
          sat: String(hours?.Saturday ?? hours?.SATURDAY ?? '9:00 — 22:00'),
          sun: String(hours?.Sunday ?? hours?.SUNDAY ?? '9:00 — 22:00'),
        })
      })
      .catch((err) => {
        setError(getErrorMessage(err, 'Failed to load establishment'))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [id])

  const handleSave = async () => {
    if (!id) return

    setError('')
    setIsSaving(true)

    try {
      await apiFetch(`/admin/restaurants/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: Number(id),
          name: values.name,
          description: values.description,
          minOrder: values.minimumOrder,
          minimumOrder: values.minimumOrder,
          phone: values.phone,
          phoneNumber: values.phone,
          category: values.category,
          city: values.city,
          deliveryAreas: values.deliveryAreas
            .split('\n')
            .map((x) => x.trim())
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
      setError(getErrorMessage(err, 'Failed to save establishment'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <EstablishmentForm
        title="Edit establishment"
        breadcrumbLast="Edit"
        values={values}
        isSaving={isSaving}
        isLoading={isLoading}
        error={error}
        submitText="Save"
        onChange={handleChange}
        onSubmit={handleSave}
        onCancel={() => navigate(-1)}
        onNavigateHome={() => navigate('/home')}
        onNavigateProfile={() => navigate('/profile')}
        onNavigateEstablishments={() => navigate('/admin/establishments')}
      />
    </MainLayout>
  )
}