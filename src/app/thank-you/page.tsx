"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const applied = sessionStorage.getItem("applied");
    const appliedSlug = sessionStorage.getItem("appliedSlug");

    if (!applied || !appliedSlug) {
      router.replace(appliedSlug ? `/apply/${appliedSlug}` : "/");
      return;
    }

    sessionStorage.removeItem("applied");

    const timer = setTimeout(() => {
      router.replace(`/apply/${appliedSlug}`);
    }, 1 * 60 * 1000); // 1 menit

    return () => {
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
        <p className="text-gray-700 mb-6">
          Your application has been submitted successfully. We will review your
          resume and contact you soon.
        </p>
        <Button onClick={() => router.push("/")}>Back to Home</Button>
      </div>
    </div>
  );
}