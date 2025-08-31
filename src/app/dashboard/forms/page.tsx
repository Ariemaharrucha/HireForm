import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllForms } from "@/lib/action/forms";
import FormsList from "@/components/dashboard/FormsList";
import { Form } from "@prisma/client";

export default async function FormsPage() {
  const forms: Form[] = await getAllForms();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Forms</h2>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/forms/new">
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              New Form
            </Button>
          </Link>
        </div>
      </div>

      <FormsList initialForms={forms} />
    </div>
  );
}
