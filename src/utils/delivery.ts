import { ESTABLISHMENT_INFO } from '../data/menuData';

export type DeliveryMode = 'pickup' | 'delivery';
export type DeliveryPrecision = 'exact' | 'street' | 'cep' | 'neighborhood';

export interface DeliveryAddress {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
}

export interface DeliveryCalculationResult {
  distanceKm: number;
  precision: DeliveryPrecision;
  resolvedLabel: string;
}

const DEFAULT_CITY_COORDS = {
  lat: -25.645841,
  lng: -49.3126653,
  label: 'Fazenda Rio Grande, PR',
};

// Verified coordinates (via OpenStreetMap Nominatim) for Fazenda Rio Grande - PR neighborhoods
const FAZENDA_NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number; label: string }> = {
  nacoes: { lat: -25.6623607, lng: -49.2945771, label: 'Nações, Fazenda Rio Grande - PR' },
  eucaliptos: { lat: -25.6402546, lng: -49.2970119, label: 'Eucaliptos, Fazenda Rio Grande - PR' },
  estados: { lat: -25.6792806, lng: -49.3248187, label: 'Estados, Fazenda Rio Grande - PR' },
  iguacu: { lat: -25.6399651, lng: -49.3260054, label: 'Iguaçu, Fazenda Rio Grande - PR' },
  pioneiros: { lat: -25.6396806, lng: -49.3153166, label: 'Pioneiros, Fazenda Rio Grande - PR' },
  santana: { lat: -25.6444512, lng: -49.3246981, label: 'Santana, Fazenda Rio Grande - PR' },
  'santa terezinha': { lat: -25.6607205, lng: -49.3282074, label: 'Santa Terezinha, Fazenda Rio Grande - PR' },
  'verde vale': { lat: -25.6538384, lng: -49.3325971, label: 'Verde Vale, Fazenda Rio Grande - PR' },
  'gralha azul': { lat: -25.6749384, lng: -49.3036671, label: 'Gralha Azul, Fazenda Rio Grande - PR' },
  veneza: { lat: -25.6992532, lng: -49.3038464, label: 'Veneza, Fazenda Rio Grande - PR' },
  'jardim veneza': { lat: -25.6992532, lng: -49.3038464, label: 'Jardim Veneza, Fazenda Rio Grande - PR' },
  hortencia: { lat: -25.6413132, lng: -49.3007398, label: 'Hortência, Fazenda Rio Grande - PR' },
  'sao sebastiao': { lat: -25.6955684, lng: -49.3062871, label: 'São Sebastião, Fazenda Rio Grande - PR' },
  ipe: { lat: -25.6454111, lng: -49.3035299, label: 'Ipê, Fazenda Rio Grande - PR' },
  centro: { lat: -25.6486058, lng: -49.3113382, label: 'Centro, Fazenda Rio Grande - PR' },
};

function normalizeLocationText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\b(bairro|jardim|jd|conjunto|conj|vila|loteamento)\b/g, ' ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findLocalNeighborhoodCoords(
  neighborhood: string
): { lat: number; lng: number; label: string } | null {
  if (!neighborhood.trim()) return null;

  const rawNorm = neighborhood
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (FAZENDA_NEIGHBORHOOD_COORDS[rawNorm]) {
    return FAZENDA_NEIGHBORHOOD_COORDS[rawNorm];
  }

  const strippedNorm = normalizeLocationText(neighborhood);
  if (FAZENDA_NEIGHBORHOOD_COORDS[strippedNorm]) {
    return FAZENDA_NEIGHBORHOOD_COORDS[strippedNorm];
  }

  for (const [key, coords] of Object.entries(FAZENDA_NEIGHBORHOOD_COORDS)) {
    if (rawNorm.includes(key) || (strippedNorm && strippedNorm.includes(key))) {
      return coords;
    }
  }

  return null;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number; externalSignal?: AbortSignal } = {}
): Promise<Response> {
  const { timeoutMs = 6000, externalSignal, ...fetchOptions } = options;
  const controller = new AbortController();

  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...fetchOptions, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    if (externalSignal) {
      externalSignal.removeEventListener('abort', onExternalAbort);
    }
  }
}

export function calculateDeliveryFee(distanceKm: number | null): number {
  const base = ESTABLISHMENT_INFO.deliveryBaseFee ?? 7.0;
  const perKm = ESTABLISHMENT_INFO.deliveryPerKmFee ?? 1.5;
  if (distanceKm === null || Number.isNaN(distanceKm) || distanceKm <= 0) {
    return base;
  }
  const exactKm = Math.round(distanceKm * 10) / 10;
  return Number((base + exactKm * perKm).toFixed(2));
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

export async function lookupCep(
  cep: string,
  signal?: AbortSignal
): Promise<{
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
} | null> {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;
  try {
    const res = await fetchWithTimeout(`https://viacep.com.br/ws/${clean}/json/`, {
      timeoutMs: 6000,
      externalSignal: signal,
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
  destLng: number,
  signal?: AbortSignal
): Promise<number> {
  const { lat: storeLat, lng: storeLng } = ESTABLISHMENT_INFO.storeCoords;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${storeLng},${storeLat};${destLng},${destLat}?overview=false`;
    const res = await fetchWithTimeout(url, { timeoutMs: 6000, externalSignal: signal });
    if (res.ok) {
      const data = await res.json();
      const meters = data?.routes?.[0]?.distance;
      if (typeof meters === 'number' && !Number.isNaN(meters)) {
        return Math.max(0.1, Math.round((meters / 1000) * 10) / 10);
      }
    }
  } catch (err) {
    if (signal?.aborted) throw err;
    // Fallback to geodesic distance with urban road factor
  }

  const straightKm = haversineKm(storeLat, storeLng, destLat, destLng);
  return Math.max(0.1, Math.round(straightKm * 1.28 * 10) / 10);
}

async function nominatimSearch(
  query: string,
  signal?: AbortSignal
): Promise<{ lat: number; lng: number; displayName: string } | null> {
  if (signal?.aborted) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(
      query
    )}`;
    const res = await fetchWithTimeout(url, {
      headers: { Accept: 'application/json' },
      timeoutMs: 6500,
      externalSignal: signal,
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

export async function calculateDeliveryDistanceAuto(
  address: {
    cep?: string;
    street: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  },
  signal?: AbortSignal
): Promise<DeliveryCalculationResult> {
  const street = address.street.trim();
  const number = (address.number || '').trim();
  const neighborhood = (address.neighborhood || '').trim();
  const cleanCep = (address.cep || '').replace(/\D/g, '');
  const city = (address.city || '').trim() || 'Fazenda Rio Grande';
  const state = (address.state || '').trim() || 'PR';

  const candidates: Array<{ query: string; precision: DeliveryPrecision }> = [];

  if (street && number) {
    candidates.push({
      query: `${street}, ${number}${neighborhood ? `, ${neighborhood}` : ''}, ${city}, ${state}, Brasil`,
      precision: 'exact',
    });
  }

  if (street) {
    candidates.push({
      query: `${street}${neighborhood ? `, ${neighborhood}` : ''}, ${city}, ${state}, Brasil`,
      precision: 'street',
    });
    if (neighborhood) {
      candidates.push({
        query: `${street}, ${city}, ${state}, Brasil`,
        precision: 'street',
      });
    }
  }

  if (cleanCep.length === 8) {
    candidates.push({
      query: `${cleanCep}, ${state}, Brasil`,
      precision: 'cep',
    });
  }

  if (neighborhood) {
    candidates.push({
      query: `${neighborhood}, ${city}, ${state}, Brasil`,
      precision: 'neighborhood',
    });
  }

  for (const candidate of candidates) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }
    const coords = await nominatimSearch(candidate.query, signal);
    if (coords) {
      const distanceKm = await calculateRouteDistanceFromStore(coords.lat, coords.lng, signal);
      return {
        distanceKm,
        precision: candidate.precision,
        resolvedLabel: coords.displayName,
      };
    }
  }

  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  // Deterministic automatic fallback using verified neighborhood center or city center (no manual input)
  const localNeighborhood = findLocalNeighborhoodCoords(neighborhood);
  const fallbackPoint = localNeighborhood || DEFAULT_CITY_COORDS;
  const distanceKm = await calculateRouteDistanceFromStore(
    fallbackPoint.lat,
    fallbackPoint.lng,
    signal
  );

  return {
    distanceKm,
    precision: 'neighborhood',
    resolvedLabel: fallbackPoint.label,
  };
}
