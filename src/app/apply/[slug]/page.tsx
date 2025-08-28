"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UploadButton } from "@/app/utils/uploadthing";

export default function ApplyPage() {
  const { slug } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resumeFile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }
    if (!formData.resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`/api/forms/${slug}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          resumeUrl: formData.resumeFile,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      toast.success("Your application has been submitted successfully!");
      router.push("/thank-you");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Job Application</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill out the form to apply for this position.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              aria-required="true"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              aria-required="true"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <UploadButton
              appearance={{
                button:
                  "ut-ready:bg-blue-600 ut-ready:hover:bg-blue-700 ut-uploading:cursor-not-allowed rounded-md text-white px-4 py-2",
                container:
                  "flex flex-col items-start gap-2 p-2 border border-gray-300 rounded-md",
                allowedContent:
                  "text-sm text-gray-500 mt-1",
              }}
              endpoint="resumeUploader"
              onUploadProgress={() => setIsUploading(true)}
              onClientUploadComplete={(res) => {
                setFormData((prev) => ({
                  ...prev,
                  resumeFile: res[0].ufsUrl,
                }));
                setIsUploading(false);
                toast.success("Resume uploaded successfully!");
              }}
              onUploadError={() => {
                setIsUploading(false);
                toast.error("Failed to upload resume. Try again.");
              }}
            />
            {isUploading && (
              <p className="text-sm text-gray-500">Uploading resume...</p>
            )}
            {formData.resumeFile && (
              <p className="text-sm text-green-600">
                ✅ Resume uploaded:{" "}
                <a
                  href={formData.resumeFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View file
                </a>
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isUploading}
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
