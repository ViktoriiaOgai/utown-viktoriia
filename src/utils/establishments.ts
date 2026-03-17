import type { Establishment } from '../types/establishment'

export function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.data?.content)) return value.data.content
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.result)) return value.result
  return []
}

export function getPageTotalPages(value: any) {
  return Math.max(
    1,
    Number(
      value?.totalPages ??
        value?.data?.totalPages ??
        value?.pages ??
        value?.data?.pages ??
        1
    )
  )
}

export function normalizeEstablishment(item: any): Establishment {
  return {
    id: Number(item?.id ?? item?.restaurantId ?? item?.restaurant_id ?? 0),
    name: String(item?.name ?? item?.restaurantName ?? item?.title ?? '—'),
    phone: String(item?.phone ?? item?.phoneNumber ?? item?.number ?? '—'),
    city: String(item?.city ?? item?.addressCity ?? item?.location?.city ?? '—'),
    ordersCount: Number(
      item?.ordersCount ??
        item?.numberOfOrders ??
        item?.orders ??
        item?.orders_count ??
        0
    ),
    description: item?.description ?? item?.about ?? '',
    category:
      item?.category ??
      item?.restaurantCategory ??
      item?.categoryName ??
      item?.type ??
      '',
    minOrder: item?.minOrder ?? item?.minimumOrder ?? item?.min_order ?? '',
    deliveryAreas:
      item?.deliveryAreas ?? item?.deliveryZone ?? item?.deliveryAddress ?? '',
    openingHours: item?.openingHours ?? item?.workingHours ?? item?.hours ?? '',
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