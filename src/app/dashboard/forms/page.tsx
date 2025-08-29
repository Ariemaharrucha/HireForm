"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FormsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 p-4 border rounded w-2xl">
        <h2>Create Form</h2>

        <Button>
          <Link href="/dashboard/forms/new">New Form</Link>
        </Button>
      </div>
    </div>
  );
}
