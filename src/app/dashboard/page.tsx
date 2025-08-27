"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  useEffect(() => {
    const syncUser = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('Error syncing user:', data.error || 'Unknown error');
          return;
        }

        // console.log('User synced successfully:', data);
      } catch (error) {
        console.error('Failed to sync user:', error);
      }
    };
    
    syncUser();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4 p-4 border rounded">
        <h2>Create Form</h2>
        <Button>
          <Link href="/dashboard/forms/new">New Form</Link>
        </Button>
      </div>
    </div>
  );
}
