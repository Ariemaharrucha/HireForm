import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getFormById } from "@/lib/action/forms";
import { SummaryDialog } from "@/components/dashboard/summary-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";


export default async function FormPageDetails({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const form = await getFormById(id);

  if (!form) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Form Not Found</CardTitle>
            <CardDescription>
              The form you are looking for does not exist or could not be loaded.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {form?.title}
          </CardTitle>
          <CardDescription>
            Review all candidates who applied for this position.
          </CardDescription>
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
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form?.candidates?.length > 0 ? (
                form?.candidates?.map((candidate, index) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell className="text-gray-600">{candidate.email}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" className="cursor-pointer">
                        <a href={candidate.resumeUrl} target="_blank">
                          View Resume
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell>
                      {/* Menggunakan komponen Dialog di sini */}
                      <SummaryDialog summary={candidate.aiSummary} />
                    </TableCell>
                    <TableCell className="text-center">
                      {candidate.aiScore !== null ? (
                        <Badge>
                          {candidate.aiScore}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
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
