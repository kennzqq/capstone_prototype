import { Calendar, Package, AlertTriangle, Clock, TrendingUp, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";

// Mock data for demonstration
const recentReservations = [
  { id: 1, facility: "Audio Visual Room A", date: "2026-01-20", time: "09:00 - 11:00", requestedBy: "Dr. Santos", status: "pending" as const },
  { id: 2, facility: "Conference Hall B", date: "2026-01-21", time: "14:00 - 16:00", requestedBy: "Prof. Garcia", status: "approved" as const },
  { id: 3, facility: "Computer Laboratory 3", date: "2026-01-22", time: "08:00 - 12:00", requestedBy: "Engr. Reyes", status: "declined" as const },
  { id: 4, facility: "Gymnasium", date: "2026-01-23", time: "13:00 - 17:00", requestedBy: "Athletic Dept.", status: "pending" as const },
];

const lowStockItems = [
  { id: 1, name: "Whiteboard Markers (Black)", quantity: 5, threshold: 20, location: "Storage A" },
  { id: 2, name: "HDMI Cables", quantity: 2, threshold: 10, location: "IT Room" },
  { id: 3, name: "Printer Paper (A4)", quantity: 3, threshold: 15, location: "Admin Office" },
  { id: 4, name: "Ethernet Cables (5m)", quantity: 4, threshold: 12, location: "IT Room" },
];

const stats = [
  { label: "Total Reservations", value: "24", icon: Calendar, sublabel: "This month", trend: "+12%" },
  { label: "Pending Approvals", value: "8", icon: Clock, sublabel: "Awaiting review", trend: null },
  { label: "Inventory Items", value: "342", icon: Package, sublabel: "Total tracked", trend: "+5%" },
  { label: "Low Stock Alerts", value: "4", icon: AlertTriangle, sublabel: "Need attention", trend: null },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card-accent p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold text-foreground tracking-tight">{stat.value}</p>
                  {stat.trend && (
                    <span className="flex items-center text-xs font-medium text-status-approved">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {stat.trend}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
              <div className="p-2 bg-secondary rounded">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reservations */}
        <div className="card-neo overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent Reservations</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="table-neo">
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      <p className="font-medium text-foreground">{reservation.facility}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{reservation.requestedBy}</p>
                    </td>
                    <td>
                      <p className="text-foreground">{reservation.date}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{reservation.time}</p>
                    </td>
                    <td>
                      <StatusBadge status={reservation.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card-neo overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-status-declined-bg rounded">
                <AlertTriangle className="h-4 w-4 text-status-declined" />
              </div>
              <h2 className="text-sm font-semibold text-foreground">Low Stock Inventory</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="table-neo">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Threshold: {item.threshold}</p>
                    </td>
                    <td>
                      <span className="inline-flex items-center justify-center w-8 h-6 text-sm font-semibold text-status-declined bg-status-declined-bg rounded">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{item.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
