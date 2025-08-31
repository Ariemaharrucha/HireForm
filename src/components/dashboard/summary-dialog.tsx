"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SummaryDialog({ summary }: { summary: string | null }) {
  if (!summary) {
    return <span className="text-gray-400">N/A</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">View Summary</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AI Generated Summary</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm max-h-[60vh] overflow-y-auto">
          <p>{summary}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}