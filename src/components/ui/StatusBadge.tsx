import { cn } from "@/lib/utils";

type ReservationStatus = "pending" | "approved" | "declined";
type InventoryStatus = "Good" | "Maintenance" | "Repair";

type Status = ReservationStatus | InventoryStatus;

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  pending: "badge-pending",
  approved: "badge-approved",
  declined: "badge-declined",
  Good: "badge-good",
  Maintenance: "badge-maintenance",
  Repair: "badge-repair",
};

const statusLabels: Record<Status, string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
  Good: "Good",
  Maintenance: "Maintenance",
  Repair: "Repair",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
