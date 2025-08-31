"use client";

import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface Form {
  id: string;
  title: string;
  createdAt: string;
}

export default function FormsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 days");
  const [forms, setForms] = useState<Form[]>([]);

  const fetchForms = async () => {
    const response = await fetch("/api/forms");
    const data = await response.json();
    setForms(data);
    // console.log(data);
    return data;
  };

  useEffect(() => {
    fetchForms();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Forms</h2>
        <div className="flex items-center gap-3">
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
          <Link href="/dashboard/forms/new">
            <Button className="bg-purple-600 hover:bg-purple-700 gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              New Form
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-white p-4 border border-gray-300 rounded-2xl ">
        {forms.map((form) => (
          <Link key={form.id} href={`/dashboard/forms/${form.id}`}>
          <div className="rounded-xl border shadow-sm hover:shadow-md transition bg-white p-4 flex flex-col justify-between cursor-pointer">
            <div className="space-y-4">
              <div className="h-32 w-full bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-3" />
              <h3 className="text-lg font-semibold">{form.title}</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{form.createdAt}</p>
              <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
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
