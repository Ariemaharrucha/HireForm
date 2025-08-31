"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createForm } from "@/lib/action/forms";

export default function NewFormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    criteria: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await createForm(formData);
      if (!response) {
        throw new Error("Failed to create form");
      }
      router.push(`/dashboard/forms/${response.id}`);
    } catch (error) {
      console.error("Error creating form:", error);
      alert(error instanceof Error ? error.message : "Failed to create form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return ( 
    <div className="container w-2/3 mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Form</CardTitle>
          <CardDescription>Create a new evaluation form for candidates</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Form Title</Label>
              <Input
                id="title"
                placeholder="e.g., Software Engineer Evaluation"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" placeholder="Describe what this form will be used for"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label>Evaluation Criteria</Label>              
                  <div className="flex items-center gap-2 w-80">
                    <Textarea
                      id="criteria"
                      placeholder="Enter evaluation criteria here"
                      value={formData.criteria}
                      onChange={(e) => setFormData({ ...formData, criteria: e.target.value })}
                      rows={5}
                    />
                  </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Form"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}