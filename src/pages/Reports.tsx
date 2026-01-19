import { FileText, Download, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reportTypes = [
  { id: 1, name: "Facility Usage Report", description: "Monthly summary of facility reservations and utilization rates", lastGenerated: "2026-01-15" },
  { id: 2, name: "Inventory Status Report", description: "Complete inventory list with status and location details", lastGenerated: "2026-01-18" },
  { id: 3, name: "Low Stock Alert Report", description: "Items below threshold requiring restocking", lastGenerated: "2026-01-19" },
  { id: 4, name: "Reservation History", description: "Historical record of all facility reservations", lastGenerated: "2026-01-10" },
  { id: 5, name: "Equipment Maintenance Log", description: "Record of equipment maintenance and repairs", lastGenerated: "2026-01-12" },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Reports</h2>
        <p className="text-sm text-muted-foreground">Generate and download system reports</p>
      </div>

      {/* Report Generator */}
      <div className="card-accent p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-secondary rounded">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Generate Custom Report</h3>
            <p className="text-xs text-muted-foreground">Create reports with custom date ranges</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((report) => (
                  <SelectItem key={report.id} value={report.name}>
                    {report.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" />
          </div>
          <div className="flex items-end">
            <Button className="w-full gap-2 shadow-sm">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="card-neo overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Available Reports</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Previously generated reports ready for download</p>
        </div>
        <div className="divide-y divide-border">
          {reportTypes.map((report) => (
            <div key={report.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-secondary rounded shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{report.name}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{report.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Last generated: {report.lastGenerated}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-2 shrink-0 w-full sm:w-auto">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
