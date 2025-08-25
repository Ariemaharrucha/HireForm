"use client";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

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
    <div className="p-6 flex items-center justify-between">
      <div>Welcome to your Dashboard 🎉</div>
      <UserButton />
    </div>
  );
}
