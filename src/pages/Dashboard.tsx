import { useState } from "react";
import { Calendar, Package, AlertTriangle, Clock, TrendingUp, ArrowUpRight, X, ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  {
    label: "Total Reservations",
    value: "24",
    icon: Calendar,
    sublabel: "This month",
    trend: "+12%",
    details: {
      topFacilities: [
        { name: "Conference Hall B", reservations: 8 },
        { name: "Audio Visual Room A", reservations: 6 },
        { name: "Gymnasium", reservations: 4 },
      ],
    },
  },
  {
    label: "Pending Approvals",
    value: "8",
    icon: Clock,
    sublabel: "Awaiting review",
    trend: null,
    details: {
      pending: recentReservations.filter(r => r.status === "pending")
    }
  },
  {
    label: "Inventory Items",
    value: "342",
    icon: Package,
    sublabel: "Total tracked",
    trend: "+5%",
    details: {
      categories: [
        { name: "Computers", count: 120 },
        { name: "Peripherals", count: 90 },
        { name: "Furniture", count: 60 },
      ]
    }
  },
  {
    label: "Low Stock Alerts",
    value: "4",
    icon: AlertTriangle,
    sublabel: "Need attention",
    trend: null,
    details: {
      items: lowStockItems
    }
  },
];

export default function Dashboard() {
  const [selectedStat, setSelectedStat] = useState<null | (typeof stats)[number]>(null);
  const [isStatOpen, setIsStatOpen] = useState(false);
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="card-accent p-5 cursor-pointer transition-all hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
            onClick={() => {
              setSelectedStat(stat);
              setIsStatOpen(true);
            }}
          >
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
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary gap-1"
              onClick={() => (window.location.href = "/facilities")}
            >
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
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-primary gap-1"
              onClick={() => (window.location.href = "/inventory")}
            >
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
        {/* Stat Details Dialog */}
        <Dialog open={isStatOpen} onOpenChange={setIsStatOpen}>
          <DialogContent className="sm:max-w-lg bg-card border border-border shadow-xl rounded-lg p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/30">
              <div className="flex items-start justify-between gap-4 w-full">
                <div className="flex items-center gap-3">
                  {selectedStat && (
                    <div className="p-2 bg-secondary rounded">
                      <selectedStat.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <DialogTitle className="text-lg font-semibold text-foreground">{selectedStat ? selectedStat.label : "Details"}</DialogTitle>
                    {selectedStat && (
                      <p className="text-xs text-muted-foreground mt-1">{(selectedStat as any).sublabel}</p>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
            <div className="p-6 space-y-4">
              {selectedStat ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-semibold text-foreground">{selectedStat.value}</p>
                      {selectedStat.trend && (
                        <div className="mt-2 inline-flex items-center gap-2 text-status-approved text-sm">
                          <TrendingUp className="h-4 w-4" /> {selectedStat.trend}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedStat.details?.topFacilities && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Top facilities</p>
                        <div className="grid gap-2">
                          {selectedStat.details.topFacilities.map((f: any) => (
                            <div key={f.name} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                              <div className="text-sm text-foreground">{f.name}</div>
                              <div className="text-sm font-medium text-muted-foreground">{f.reservations}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStat.details?.pending && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Pending requests</p>
                        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                          {selectedStat.details.pending.map((p: any) => (
                            <div key={p.facility + p.date} className="p-3 bg-muted/30 rounded flex items-start justify-between">
                              <div>
                                <div className="text-sm font-medium text-foreground">{p.facility}</div>
                                <div className="text-xs text-muted-foreground">{p.date} • {p.time}</div>
                                <div className="text-xs text-muted-foreground">Requested by {p.requestedBy}</div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStat.details?.categories && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Inventory by category</p>
                        <div className="grid gap-2">
                          {selectedStat.details.categories.map((c: any) => (
                            <div key={c.name} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                              <div className="text-sm text-foreground">{c.name}</div>
                              <div className="text-sm font-medium text-muted-foreground">{c.count}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedStat.details?.items && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Low stock items</p>
                        <div className="grid gap-2">
                          {selectedStat.details.items.map((it: any) => (
                            <div key={it.id} className="flex items-center justify-between p-3 bg-status-declined-bg/10 rounded border border-status-declined/10">
                              <div>
                                <div className="text-sm font-medium text-foreground">{it.name}</div>
                                <div className="text-xs text-muted-foreground">Threshold: {it.threshold} — {it.location}</div>
                              </div>
                              <div className="inline-flex items-center justify-center w-8 h-6 text-sm font-semibold text-status-declined bg-status-declined-bg rounded">{it.quantity}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No detail selected.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
