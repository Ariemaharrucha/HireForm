"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"

export default function ApplyPage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resumeFile: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    
    if (name === 'resumeFile' && files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const uploadResume = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
    const response = await fetch(`/api/uploadthing`, {
      method: 'POST',
      body: formData,
    });
    
    // if (!response.ok) {
    //   throw new Error('Failed to upload resume');
    // }
    
    const data = await response.json();
    // console.log(data)
    return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload resume');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast("Error", {description: "Name and email are required"});
      return;
    }
    
    if (!formData.resumeFile) {
      toast("Error", {description: "Please upload your resume"});
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Upload resume and get URL
      const resumeUrl = await uploadResume(formData.resumeFile);
      
      // Submit application
      const response = await fetch(`/api/forms/${slug}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          resumeUrl,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }
      
      toast("Success!", {description: "Your application has been submitted successfully!"});
      
      // Redirect to thank you page or home
      // router.push('/thank-you');
      
    } catch (error) {
      console.error('Submission error:', error);
      toast("Error", {description: error instanceof Error ? error.message : 'Failed to submit application'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Job Application</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please fill out the form below to apply for this position.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="resume" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input id="resume" name="resumeFile" type="file" className="sr-only" onChange={handleChange} accept=".pdf" required />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF max 4 MB
                </p>
                {formData.resumeFile && (
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {formData.resumeFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}