import type { Establishment } from '../types/establishment'

type AnyObject = Record<string, unknown>

export function asArray<T = unknown>(value: unknown): T[] {
  const v = value as AnyObject

  if (Array.isArray(value)) return value
  if (Array.isArray(v?.content)) return v.content as T[]
  if (Array.isArray((v.data as AnyObject)?.content))
    return (v.data as AnyObject).content as T[]
  if (Array.isArray(v?.data)) return v.data as T[]
  if (Array.isArray(v?.items)) return v.items as T[]
  if (Array.isArray(v?.result)) return v.result as T[]

  return []
}

export function getPageTotalPages(value: unknown) {
  const v = value as AnyObject
  const data = v?.data as AnyObject | undefined

  return Math.max(
    1,
    Number(
      v?.totalPages ??
      data?.totalPages ??
      v?.pages ??
      data?.pages ??
      1
    )
  )
}

export function normalizeEstablishment(item: unknown): Establishment {
  const i = item as AnyObject
  const location = i?.location as AnyObject | undefined

  return {
    id: Number(i?.id ?? i?.restaurantId ?? i?.restaurant_id ?? 0),
    name: String(i?.name ?? i?.restaurantName ?? i?.title ?? '—'),
    phone: String(i?.phone ?? i?.phoneNumber ?? i?.number ?? '—'),
    city: String(i?.city ?? i?.addressCity ?? location?.city ?? '—'),
    ordersCount: Number(
      i?.ordersCount ??
      i?.numberOfOrders ??
      i?.orders ??
      i?.orders_count ??
      0
    ),
    description: (i?.description ?? i?.about ?? '') as string,
    category:
      (i?.category ??
        i?.restaurantCategory ??
        i?.categoryName ??
        i?.type ??
        '') as string,
    minOrder: (i?.minOrder ?? i?.minimumOrder ?? i?.min_order ?? '') as string,
    deliveryAreas:
      (i?.deliveryAreas ?? i?.deliveryZone ?? i?.deliveryAddress ?? '') as string,
    openingHours:
      (i?.openingHours ?? i?.workingHours ?? i?.hours ?? '') as string,
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof Error) {
    return error.message || fallback
  }

  if (typeof error === 'string' && error.trim()) {
    return error
  }

  return fallback
}

import { api } from '../services/api'

export async function getOrders(page = 0, size = 6) {
  const response = await api.get(`/admin/orders?page=${page}&size=${size}`)
  return response.data
}