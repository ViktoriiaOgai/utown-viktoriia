export type Establishment = {
  id: number
  name: string
  phone: string
  city: string
  ordersCount: number
  description?: string
  category?: string
  minOrder?: string | number
  deliveryAreas?: string[] | string
  openingHours?: Record<string, string> | string
}

export type PageResponse<T> = {
  content?: T[]
  totalPages?: number
  totalElements?: number
  number?: number
  size?: number
}

export type EstablishmentFormValues = {
  name: string
  description: string
  minimumOrder: string
  phone: string
  category: string
  city: string
  deliveryAreas: string
  mon: string
  tue: string
  wed: string
  thu: string
  fri: string
  sat: string
  sun: string
}