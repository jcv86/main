import { NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Mock Chilean companies data
    const companies = [
      {
        id: "1",
        name: "Banco de Chile",
        industry: "Servicios Financieros",
        size: "Grande",
        location: "Santiago",
        description: "Uno de los principales bancos de Chile",
        website: "https://www.bancochile.cl",
        logo: "/placeholder.svg?height=50&width=50&text=BC",
      },
      {
        id: "2",
        name: "Falabella",
        industry: "Retail",
        size: "Grande",
        location: "Santiago",
        description: "Empresa líder en retail y servicios financieros",
        website: "https://www.falabella.com",
        logo: "/placeholder.svg?height=50&width=50&text=F",
      },
      {
        id: "3",
        name: "CODELCO",
        industry: "Minería",
        size: "Grande",
        location: "Santiago",
        description: "Corporación Nacional del Cobre de Chile",
        website: "https://www.codelco.com",
        logo: "/placeholder.svg?height=50&width=50&text=C",
      },
      {
        id: "4",
        name: "Entel",
        industry: "Telecomunicaciones",
        size: "Grande",
        location: "Santiago",
        description: "Empresa líder en telecomunicaciones",
        website: "https://www.entel.cl",
        logo: "/placeholder.svg?height=50&width=50&text=E",
      },
      {
        id: "5",
        name: "Ripley",
        industry: "Retail",
        size: "Grande",
        location: "Santiago",
        description: "Cadena de tiendas por departamento",
        website: "https://www.ripley.cl",
        logo: "/placeholder.svg?height=50&width=50&text=R",
      },
    ]

    return NextResponse.json({
      success: true,
      data: companies,
      total: companies.length,
    })
  } catch (error) {
    console.error("Error fetching companies data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch companies data",
        data: [],
      },
      { status: 500 },
    )
  }
}
