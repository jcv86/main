import { NextResponse } from 'next/server'

// Mock data for MVP - In production, connect to real INE API
// Real API: https://www.ine.cl/

export async function GET(request: Request) {
  try {
    const mockData = {
      unemployment_rate: 7.8,
      variation_monthly: 0.2,
      variation_annual: -0.5,
      employed: 8234500,
      unemployed: 689300,
      inactive: 5876400,
      last_update: new Date().toISOString(),
      source: 'Instituto Nacional de Estadísticas (INE)',
      by_sector: {
        agriculture: 3.2,
        mining: 4.1,
        manufacturing: 6.5,
        construction: 9.2,
        commerce: 8.1,
        services: 7.4,
        technology: 3.8,
      },
      by_region: {
        metropolitana: 8.1,
        valparaiso: 7.9,
        ohiggins: 6.4,
        maule: 7.2,
        biobio: 8.3,
        araucania: 9.1,
      },
      insight:
        'Desempleo en 7.8% con tendencia alcista (+0.2% mensual). Tech sector resistente (3.8%), construcción presionada (9.2%). Regiones con disparidades: Araucanía 9.1% vs O\'Higgins 6.4%. Oportunidad en sectores con falta de talento calificado.',
    }

    return NextResponse.json(mockData, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching INE data:', error)
    return NextResponse.json({ error: 'Failed to fetch employment data' }, { status: 500 })
  }
}
