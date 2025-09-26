"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "resumeUrl", label: "Resume URL" },
  { key: "aiScore", label: "AI Score" },
  { key: "status", label: "Status" },
  { key: "aiSummary", label: "AI Summary" },
  { key: "aiCriteriaAnalysis", label: "Criteria Analysis" },
]

export default function ExportCandidateCsv() {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(columns.map(c => c.key))

  const toggleColumn = (key: string) => {
    setSelectedColumns(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const handleExport = async () => {
    const res = await fetch("/api/export-candidates", {
      method: "POST",
      body: JSON.stringify({ columns: selectedColumns }),
    })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "candidates.csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Export CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Columns to Export</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            {columns.map(col => (
              <label key={col.key} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedColumns.includes(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                />
                {col.label}
              </label>
            ))}
          </div>
          <Button className="w-full cursor-pointer" onClick={handleExport}>
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
