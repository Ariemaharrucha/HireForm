"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Folders } from "lucide-react"

const navigation = [
  { name: "Forms", href: "/dashboard/forms", icon: Folders },
]

export default function Sidebar() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const currentPage = segments[segments.length - 1]

  return (
    <aside className="w-60 border-r border-gray-200 bg-white h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <div className="text-sm text-gray-500 mb-4">
          <span>Dashboard</span> <span className="mx-1">/</span>
          <span className="capitalize">{currentPage}</span>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center w-full justify-start px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-purple-50 text-purple-700 hover:bg-purple-100" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
