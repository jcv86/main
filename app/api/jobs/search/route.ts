import { NextResponse } from "next/server"

// Force dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Mock Chilean jobs data
    const jobs = [
      {
        id: "1",
        title: "Desarrollador Full Stack",
        company: "Banco de Chile",
        location: "Santiago, Chile",
        type: "Tiempo Completo",
        experience: "2-4 años",
        salary: {
          min: 1500000,
          max: 2500000,
          currency: "CLP",
        },
        description: "Buscamos un desarrollador full stack para unirse a nuestro equipo de tecnología.",
        skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
        category: "Tecnología",
        isRemote: false,
        postedDate: "2024-01-15",
        applicationDeadline: "2024-02-15",
        benefits: ["Seguro de salud", "Bonos por desempeño", "Capacitación"],
      },
      {
        id: "2",
        title: "Analista de Marketing Digital",
        company: "Falabella",
        location: "Santiago, Chile",
        type: "Tiempo Completo",
        experience: "1-3 años",
        salary: {
          min: 1200000,
          max: 1800000,
          currency: "CLP",
        },
        description: "Únete a nuestro equipo de marketing digital y ayuda a impulsar nuestras campañas.",
        skills: ["Google Analytics", "Facebook Ads", "SEO", "Content Marketing"],
        category: "Marketing",
        isRemote: true,
        postedDate: "2024-01-14",
        applicationDeadline: "2024-02-14",
        benefits: ["Trabajo remoto", "Horario flexible", "Capacitación"],
      },
      {
        id: "3",
        title: "Ingeniero de Minas",
        company: "CODELCO",
        location: "Antofagasta, Chile",
        type: "Tiempo Completo",
        experience: "3-5 años",
        salary: {
          min: 2000000,
          max: 3000000,
          currency: "CLP",
        },
        description: "Oportunidad para trabajar en uno de los proyectos mineros más importantes de Chile.",
        skills: ["Minería", "Geología", "AutoCAD", "Gestión de Proyectos"],
        category: "Minería",
        isRemote: false,
        postedDate: "2024-01-13",
        applicationDeadline: "2024-02-13",
        benefits: ["Seguro de salud", "Bonos", "Alojamiento"],
      },
      {
        id: "4",
        title: "Especialista en Telecomunicaciones",
        company: "Entel",
        location: "Valparaíso, Chile",
        type: "Tiempo Completo",
        experience: "2-4 años",
        salary: {
          min: 1600000,
          max: 2200000,
          currency: "CLP",
        },
        description: "Buscamos un especialista para nuestro equipo de infraestructura de telecomunicaciones.",
        skills: ["Redes", "Telecomunicaciones", "5G", "Fibra Óptica"],
        category: "Telecomunicaciones",
        isRemote: false,
        postedDate: "2024-01-12",
        applicationDeadline: "2024-02-12",
        benefits: ["Seguro de salud", "Capacitación técnica", "Bonos"],
      },
      {
        id: "5",
        title: "Gerente de Ventas",
        company: "Ripley",
        location: "Concepción, Chile",
        type: "Tiempo Completo",
        experience: "5+ años",
        salary: {
          min: 2500000,
          max: 3500000,
          currency: "CLP",
        },
        description: "Oportunidad de liderar el equipo de ventas en una de nuestras tiendas principales.",
        skills: ["Liderazgo", "Ventas", "Gestión de Equipos", "Retail"],
        category: "Ventas",
        isRemote: false,
        postedDate: "2024-01-11",
        applicationDeadline: "2024-02-11",
        benefits: ["Comisiones", "Seguro de salud", "Descuentos empleado"],
      },
    ]

    return NextResponse.json({
      success: true,
      data: jobs,
      total: jobs.length,
      query: "",
      filters: {},
    })
  } catch (error) {
    console.error("Error searching jobs:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search jobs",
        data: [],
        total: 0,
      },
      { status: 500 },
    )
  }
}
