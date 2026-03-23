import type { Establishment } from '../types/establishment'

export function asArray<T = unknown>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    
    if (Array.isArray(obj.content)) return obj.content as T[];
    if (obj.data && typeof obj.data === 'object') {
      const dataObj = obj.data as Record<string, unknown>;
      if (Array.isArray(dataObj.content)) return dataObj.content as T[];
      if (Array.isArray(obj.data)) return obj.data as T[];
    }
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.result)) return obj.result as T[];
  }

  return [];
}

export function getPageTotalPages(value: unknown): number {
  if (!value || typeof value !== 'object') return 1;
  const obj = value as Record<string, unknown>;
  const totalPages =
    obj.totalPages ??
    (obj.data && typeof obj.data === 'object' ? (obj.data as Record<string, unknown>).totalPages : undefined) ??
    obj.pages ??
    (obj.data && typeof obj.data === 'object' ? (obj.data as Record<string, unknown>).pages : undefined) ??
    1;

  return Math.max(1, Number(totalPages));
}

export function normalizeEstablishment(item: unknown): Establishment {
  if (!item || typeof item !== "object") item = {}
  const obj = item as Record<string, unknown>

  const getValue = (keys: string[]): unknown => {
    for (const key of keys) {
      if (obj[key] != null) return obj[key]
    }
    return undefined
  }

  const getString = (value: unknown, fallback = ''): string =>
    typeof value === 'string' || typeof value === 'number' ? String(value) : fallback

  const getNumber = (value: unknown, fallback = 0): number =>
    typeof value === 'number' || typeof value === 'string' ? Number(value) : fallback

  const getStringOrNumber = (value: unknown): string | number | undefined => {
    if (typeof value === 'string' || typeof value === 'number') return value
    return undefined
  }

  const location = getValue(['location'])
  const city =
    location && typeof location === 'object'
      ? getString((location as Record<string, unknown>).city, '—')
      : getString(getValue(['city', 'addressCity']), '—')

  // deliveryAreas может быть массивом строк или одной строкой
  const deliveryRaw = getValue(['deliveryAreas', 'deliveryZone', 'deliveryAddress'])
  const deliveryAreas = Array.isArray(deliveryRaw)
    ? deliveryRaw.map(v => getString(v))
    : getString(deliveryRaw, '')

  const openingRaw = getValue(['openingHours', 'workingHours', 'hours'])
  const openingHours =
    typeof openingRaw === 'string' || typeof openingRaw === 'number'
      ? getString(openingRaw)
      : typeof openingRaw === 'object' && openingRaw !== null
      ? (openingRaw as Record<string, string>)
      : ''

  return {
    id: getNumber(getValue(['id', 'restaurantId', 'restaurant_id']), 0),
    name: getString(getValue(['name', 'restaurantName', 'title']), '—'),
    phone: getString(getValue(['phone', 'phoneNumber', 'number']), '—'),
    city,
    ordersCount: getNumber(getValue(['ordersCount', 'numberOfOrders', 'orders', 'orders_count']), 0),
    description: getString(getValue(['description', 'about']), ''),
    category: getString(getValue(['category', 'restaurantCategory', 'categoryName', 'type']), ''),
    minOrder: getStringOrNumber(getValue(['minOrder', 'minimumOrder', 'min_order'])),
    deliveryAreas,
    openingHours,
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