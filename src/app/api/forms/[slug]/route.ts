import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: {params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    try {
    const formDetail = await prisma.form.findUnique({
        where: { slug },
        select: {
            title: true,
            criteria: true,
        }
    });

    if (!formDetail) {
        return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    return NextResponse.json({
        success: true,
        data: formDetail,
      });
    } catch (error) {
        console.error("Error fetching form detail:", error);
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 }
        );
      }
}
    
