"use client";

import { useState } from "react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Form } from "@prisma/client";
import { toast } from "sonner";

export default function FormsList({ initialForms }: { initialForms: Form[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState("All time");
  const [forms] = useState(initialForms);

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/apply/${slug}`;
    await navigator.clipboard.writeText(url);

    toast.success("Link copied!", {
      description: "Form link has been copied to clipboard.",
      duration: 2000,
    });
  };

  return (
    <div>
      <div className="flex justify-end mt-4">
        {/* DropdownMenu dan logikanya ada di sini */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                {selectedPeriod} <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Last 7 days")}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Last 30 days")}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("Last 90 days")}>
                Last 90 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      {/* Grid untuk menampilkan semua 'forms' ada di sini */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-white p-4 border border-gray-300 rounded-2xl ">
      {forms.length === 0 ? (
        <p className="text-center">No forms found.</p>
      ) : forms.map((form) => (
          <Link key={form.id} href={`/dashboard/forms/${form.id}`}>
          <div className="rounded-xl border shadow-sm hover:shadow-md transition bg-white p-4 flex flex-col justify-between cursor-pointer">
            <div className="space-y-4">
              <div className="h-32 w-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-3" />
              <h3 className="text-lg font-semibold">{form.title}</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {form.createdAt.toLocaleDateString('id-ID')}
              </p>
              <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      handleCopyLink(form.slug);
                    }} className="cursor-pointer">Copy Link</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 cursor-pointer">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}