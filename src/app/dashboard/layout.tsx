import { Bell, Workflow } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import { getCurrentUser } from "@/lib/action/users"
import { Sidebar } from "@/components/dashboard/sidebar"


interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getCurrentUser();

  if (!user) {
    return <div className="p-6">Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Workflow className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <UserButton />
        </div>
      </header>

      <div className="flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
