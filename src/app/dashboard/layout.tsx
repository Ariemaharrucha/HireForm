import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div>
    <div className="p-6 flex items-center justify-between">
      <div>Welcome to your Dashboard 🎉</div>
      <UserButton />
    </div>
    {children}
    </div>;
}