"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export function CandidateFilterDialog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // console.log(searchParams);

  const [minScore, setMinScore] = useState(searchParams.get("score") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minScore) { params.set("score", minScore); } else { params.delete("score"); }
    if (status) { params.set("status", status); } else { params.delete("status"); }
    router.push(`?${params.toString()}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Filter</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Candidates</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="score">Minimum AI Score</Label>
            <Input
              id="score"
              type="number"
              placeholder="e.g. 70"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={applyFilter}>
            Apply Filter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
