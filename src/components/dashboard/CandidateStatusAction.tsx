"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { updateCandidateStatus } from "@/lib/action/candidate";
import { useRouter } from "next/navigation";

export function CandidateStatusAction({ candidate }: { candidate: { id: string; status: string } }) {
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleUpdate = (status: "pending" | "shortlisted" | "rejected") => {
    startTransition(async () => {
      await updateCandidateStatus(candidate.id, status);
      router.refresh(); 
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleUpdate("shortlisted")}>
          Mark as Shortlisted
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUpdate("rejected")} className="text-red-600">
          Mark as Rejected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleUpdate("pending")}>
          Reset to Pending
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
