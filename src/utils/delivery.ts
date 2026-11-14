import { ESTABLISHMENT_INFO } from '../data/menuData';

export type DeliveryMode = 'pickup' | 'delivery';

export interface DeliveryAddress {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
}

export function calculateDeliveryFee(distanceKm: number | null): number {
  const base = ESTABLISHMENT_INFO.deliveryBaseFee ?? 7.0;
  const perKm = ESTABLISHMENT_INFO.deliveryPerKmFee ?? 1.5;
  if (distanceKm === null || Number.isNaN(distanceKm) || distanceKm < 0) {
    return base;
  }
  return Number((base + distanceKm * perKm).toFixed(2));
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function lookupCep(cep: string): Promise<{
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
} | null> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
    };
  } catch {
    return null;
  }
}

export async function calculateRouteDistanceFromStore(
  destLat: number,
  destLng: number
): Promise<number> {
  const { lat: storeLat, lng: storeLng } = ESTABLISHMENT_INFO.storeCoords;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${storeLng},${storeLat};${destLng},${destLat}?overview=false`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data = await res.json();
      const meters = data?.routes?.[0]?.distance;
      if (typeof meters === 'number' && !Number.isNaN(meters)) {
        return Math.max(0.1, Math.round((meters / 1000) * 10) / 10);
      }
    }
  } catch {
    // Fallback to geodesic distance with urban road factor
  }

  const straightKm = haversineKm(storeLat, storeLng, destLat, destLng);
  return Math.max(0.1, Math.round(straightKm * 1.28 * 10) / 10);
}

async function nominatimSearch(query: string): Promise<{ lat: number; lng: number; displayName: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6500),
    });
    if (!res.ok) return null;
    const results = await res.json();
    if (Array.isArray(results) && results.length > 0) {
      const first = results[0];
      const lat = parseFloat(first.lat);
      const lng = parseFloat(first.lon);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        return { lat, lng, displayName: first.display_name || query };
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function geocodeAndCalculateDistance(address: {
  cep?: string;
  street: string;
  number?: string;
  neighborhood?: string;
}): Promise<{ distanceKm: number; resolvedLabel: string }> {
  const street = address.street.trim();
  const number = (address.number || '').trim();
  const neighborhood = (address.neighborhood || '').trim();
  const cleanCep = (address.cep || '').replace(/\D/g, '');

  const queries: string[] = [];
  if (street) {
    queries.push(
      `${street}${number ? `, ${number}` : ''}${neighborhood ? `, ${neighborhood}` : ''}, Fazenda Rio Grande, PR, Brasil`
    );
    queries.push(`${street}, Fazenda Rio Grande, PR, Brasil`);
  }
  if (cleanCep.length === 8) {
    queries.push(`${cleanCep}, Paraná, Brasil`);
  }
  if (neighborhood) {
    queries.push(`${neighborhood}, Fazenda Rio Grande, PR, Brasil`);
  }

  for (const q of queries) {
    const coords = await nominatimSearch(q);
    if (coords) {
      const distanceKm = await calculateRouteDistanceFromStore(coords.lat, coords.lng);
      return { distanceKm, resolvedLabel: coords.displayName };
    }
  }

  throw new Error('Endereço não localizado automaticamente. Use o GPS ou informe a distância aproximada abaixo.');
}
