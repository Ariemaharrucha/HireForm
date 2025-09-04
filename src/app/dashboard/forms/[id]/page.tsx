import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { getFormById } from "@/lib/action/forms";
import { SummaryDialog } from "@/components/dashboard/SummaryDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteCandidate, filterCandidate } from "@/lib/action/candidate";
import { redirect } from "next/navigation";
import { CandidateFilterDialog } from "@/components/dashboard/CandidateFilterDialog";
import { CandidateStatusAction } from "@/components/dashboard/CandidateStatusAction";

export default async function FormPageDetails({params, searchParams}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ score?: string; status?: string }>;
}) {
  const { id } = await params;
  const { score, status } = await searchParams;

  const form = await getFormById(id);

  if (!form) {
    redirect("/dashboard");
  }

  const minScore = score ? parseInt(score) : undefined;
  const candidateStatus = status && status !== "all" ? status : undefined;


  const filteredCandidates = await filterCandidate(id, minScore, candidateStatus);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {form?.title}
            </CardTitle>
            <CardDescription>
              Review all candidates who applied for this position.
            </CardDescription>
          </div>
          <CandidateFilterDialog />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Resume</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead className="text-center">AI Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate, index) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {candidate.email}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <a href={candidate.resumeUrl} target="_blank">
                          View Resume
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <SummaryDialog summary={candidate.aiSummary} />
                    </TableCell>
                    <TableCell className="text-center">
                      {candidate.aiScore !== null ? (
                        <Badge>{candidate.aiScore}</Badge>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {candidate.status === "shortlisted" && (
                        <Badge className="bg-green-500 text-white">Shortlisted</Badge>
                      )}
                      {candidate.status === "rejected" && (
                        <Badge className="bg-red-500 text-white">Rejected</Badge>
                      )}
                      {candidate.status === "pending" && (
                        <Badge className="bg-yellow-500 text-white">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <CandidateStatusAction candidate={{ id: candidate.id, status: candidate.status }} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No candidates found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
