import { getFormById } from "@/lib/action/forms";

interface Form {
    id: string;
    title: string;
    description: string;
    criteria: string;
    createdAt: string;
    candidates: {
        id: string;
        name: string;
        email: string;
        resumeUrl: string;
        resumeText: string;
        aiSummary: string;
        aiScore: number;
        aiCriteriaAnalysis: string;
    }[];
}

export default async function FormPageDetails({ params }: { params: { id: string } }) {
    const { id } = await params;
    const form = await getFormById(id);
    // if (!data.ok) throw new Error("Failed to fetch form")
    // console.log(form)
    
   return (
        <div>
            <h1 className="font-semibold">{form?.title}</h1>

        </div>
    );
}