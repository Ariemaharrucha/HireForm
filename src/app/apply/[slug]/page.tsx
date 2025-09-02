"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUploadThing } from "@/utils/uploadthing";
import { FileText, X, Loader2 } from "lucide-react";
import { applyCandidate, checkCandidate } from "@/lib/action/application";
import { getFormBySlug } from "@/lib/action/forms";

export default function ApplyPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [files, setFiles] = useState<File[]>([]);

  const [formDetail, setFormDetail] = useState({ title: "", criteria: "" });
  const [isFetchingDetail, setIsFetchingDetail] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload } = useUploadThing("resumeUploader");

  useEffect(() => {
    const fetchFormDetail = async () => {
      try {
        setIsFetchingDetail(true);
        const response = await getFormBySlug(slug as string);
        setFormDetail({
          title: response.title,
          criteria: response.criteria,
        });
      } catch (error) {
        toast.error("Failed to load form details.");
      } finally {
        setIsFetchingDetail(false);
      }
    };
    fetchFormDetail();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required.");
      return;
    }
    if (files.length === 0) {
      toast.error("Please select your resume to upload.");
      return;
    }
  
    setIsSubmitting(true);
    try {
      // 1️⃣ Cek apakah email sudah pernah apply
      const check = await checkCandidate(slug as string, formData.email);
      if (check.exists) {
        throw new Error("You have already applied to this form.");
      }
  
      // 2️⃣ Upload file resume
      const uploadResponse = await startUpload(files);
      if (!uploadResponse || !uploadResponse[0].ufsUrl) {
        throw new Error("Resume upload failed. Please try again.");
      }
      const resumeUrl = uploadResponse[0].ufsUrl;
  
      // 3️⃣ Apply candidate
      const result = await applyCandidate({
        slug: slug as string,
        name: formData.name,
        email: formData.email,
        resumeUrl,
        criteria: formDetail.criteria,
      });
  
      if (!result.success) {
        throw new Error(result.error || "Failed to submit application.");
      }
  
      toast.success("Your application has been submitted successfully!");
      sessionStorage.setItem("applied", "true");
      sessionStorage.setItem("appliedSlug", slug as string);
      router.push("/thank-you");
  
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetchingDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">HireForm</h1>
          <p className="mt-2 text-lg font-semibold text-gray-800">{formDetail.title}</p>
          <p className="mt-1 text-sm text-gray-600">{formDetail.criteria}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF, max 4MB)</Label>
            {files.length > 0 ? (
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate">{files[0].name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setFiles([])} disabled={isSubmitting}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full px-4 py-3 text-sm text-gray-700 bg-gray-50 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                <span>Click to choose a file</span>
                <Input id="resume" type="file" className="hidden" onChange={handleFileChange} accept=".pdf" disabled={isSubmitting} />
              </label>
            )}
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
