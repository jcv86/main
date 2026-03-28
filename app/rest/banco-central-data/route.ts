import { NextResponse } from 'next/server'

// Mock data for MVP - In production, connect to real Banco Central API
// Real API: https://www.bcentral.cl/web/banco-central/api-estadisticas-economicas

export async function GET(request: Request) {
  try {
    // In production:
    // const response = await fetch('https://si3.bcentral.cl/siete/ES/...')
    // For now, return realistic mock data with timestamps

    const mockData = {
      imacec: {
        value: 102.3,
        variation_monthly: -0.5,
        variation_annual: 1.2,
        last_update: new Date().toISOString(),
        source: 'Banco Central de Chile',
      },
      ipc: {
        value: 118.4,
        variation_monthly: 0.3,
        variation_annual: 4.1,
        last_update: new Date().toISOString(),
        source: 'Banco Central de Chile',
      },
      tpm: {
        value: 8.25,
        variation: -0.25,
        last_update: new Date().toISOString(),
        source: 'Banco Central de Chile',
      },
      uf: {
        value: 36284.56,
        variation: 0.12,
        last_update: new Date().toISOString(),
        source: 'Banco Central de Chile',
      },
      dolar: {
        value: 932.5,
        variation: 1.2,
        last_update: new Date().toISOString(),
        source: 'Banco Central de Chile',
      },
      insight:
        'Mercado en volatilidad: IMACEC muestra contracción mensual (-0.5%), IPC presiona al alza (4.1% anual). TPM en 8.25% genera presión sobre crédito. Dólar volátil (+1.2%). Sector financiero y tech enfrentan presión. Oportunidad en sectores defensivos.',
    }

    // Set cache headers for 24 hours
    return NextResponse.json(mockData, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    })
  } catch (error) {
    console.error('[v0] Error fetching Banco Central data:', error)
    return NextResponse.json({ error: 'Failed to fetch economic data' }, { status: 500 })
  }
}
