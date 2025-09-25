import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import Papa from "papaparse"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { columns, formId } = body as { columns: string[]; formId: string }

    if (!columns || columns.length === 0) {
      return NextResponse.json({ error: "No columns selected" }, { status: 400 })
    }

    // Ambil data kandidat sesuai form
    const candidates = await prisma.candidate.findMany({
      where: { formId },
      select: {
        id: true,
        name: true,
        email: true,
        resumeUrl: true,
        aiScore: true,
        aiSummary: true,
        aiCriteriaAnalysis: true,
        status: true,
        createdAt: true,
      },
    })

    // Map hanya field yang dipilih
    const filtered = candidates.map((c) => {
      const row: Record<string, any> = {}
      columns.forEach((col) => {
        row[col] = (c as any)[col] ?? ""
      })
      return row
    })

    // Convert ke CSV
    const csv = Papa.unparse(filtered)

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="candidates.csv"`,
      },
    })
  } catch (err) {
    console.error("Export error:", err)
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 })
  }
}
