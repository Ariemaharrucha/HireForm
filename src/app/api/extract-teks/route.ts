import { extractTextFromPdf } from "@/lib/text-extract";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await extractTextFromPdf("https://copb0mnegq.ufs.sh/f/VyPo6P8vLo6spYsbm4LMEv1Roaq0Tk5ZNwsFJprAiYKbDdeQ");
    return NextResponse.json(data);
}