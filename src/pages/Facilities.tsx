import { useState } from "react";
import { Toaster, toast } from "@/components/ui/sonner";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock calendar data
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  
  const days: (number | null)[] = [];
  
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  return days;
};

const facilities = [
  "Audio Visual Room A",
  "Audio Visual Room B",
  "Conference Hall A",
  "Conference Hall B",
  "Computer Laboratory 1",
  "Computer Laboratory 2",
  "Computer Laboratory 3",
  "Gymnasium",
  "Auditorium",
  "Function Hall",
];

const reservations = [
  { day: 20, facility: "AV Room A", status: "pending" as const },
  { day: 21, facility: "Conf Hall B", status: "approved" as const },
  { day: 22, facility: "Comp Lab 3", status: "declined" as const },
  { day: 23, facility: "Gymnasium", status: "pending" as const },
  { day: 25, facility: "Auditorium", status: "approved" as const },
];

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Facilities() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 19));
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [facilityValue, setFacilityValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
    // Handle submit for reservation form
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSheetOpen(false);
      const form = e.currentTarget as HTMLFormElement;
      const date = (form.querySelector<HTMLInputElement>("#date")?.value) || "(no date)";
      const purpose = (form.querySelector<HTMLInputElement>("#purpose")?.value) || "(no purpose)";
      const requestedBy = (form.querySelector<HTMLInputElement>("#requestedBy")?.value) || "(no requester)";
      const department = (form.querySelector<HTMLInputElement>("#department")?.value) || "(no department)";

      toast.success("Reservation submitted");
    };
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateCalendarDays(year, month);
  
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getReservationForDay = (day: number) => {
    return reservations.find(r => r.day === day);
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Facility Reservations</h2>
          <p className="text-sm text-muted-foreground">Manage and schedule facility bookings</p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              New Reservation
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Create New Reservation</SheetTitle>
            </SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="facility">Facility</Label>
                <Select value={facilityValue} onValueChange={setFacilityValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a facility" />
                  </SelectTrigger>
                  <SelectContent>
                    {facilities.map((facility) => (
                      <SelectItem key={facility} value={facility}>
                        {facility}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time Slot</Label>
                  <Select value={timeValue} onValueChange={setTimeValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="08:00-10:00">08:00 - 10:00</SelectItem>
                      <SelectItem value="10:00-12:00">10:00 - 12:00</SelectItem>
                      <SelectItem value="13:00-15:00">13:00 - 15:00</SelectItem>
                      <SelectItem value="15:00-17:00">15:00 - 17:00</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Input id="purpose" name="purpose" placeholder="Enter purpose of reservation" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestedBy">Requested By</Label>
                <Input id="requestedBy" name="requestedBy" placeholder="Name of requester" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" placeholder="Department or college" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsSheetOpen(false)}>
                  Cancel
                </Button>
                  <Button type="submit">Submit Request</Button>
                  <div className="space-y-6">
                    {/* Removed duplicate Toaster */}
                  </div>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Calendar */}
      <div className="card-neo overflow-hidden">
        {/* Calendar Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {monthNames[month]} {year}
              </h3>
              <p className="text-xs text-muted-foreground">Reservation calendar</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const reservation = day ? getReservationForDay(day) : null;
              const isToday = day === 19;
              
              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[80px] lg:min-h-[100px] p-2 rounded transition-colors",
                    day ? "bg-card border border-border hover:border-primary/30 cursor-pointer" : "",
                    isToday && "ring-2 ring-primary ring-offset-1"
                  )}
                >
                  {day && (
                    <>
                      <span className={cn(
                        "text-xs font-medium",
                        isToday ? "text-primary" : "text-muted-foreground"
                      )}>
                        {day}
                      </span>
                      {reservation && (
                        <div className="mt-1.5 space-y-1">
                          <p className="text-[10px] lg:text-xs font-medium text-foreground truncate">
                            {reservation.facility}
                          </p>
                          <StatusBadge 
                            status={reservation.status} 
                            className="text-[9px] lg:text-[10px] px-1.5 py-0" 
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <StatusBadge status="pending" />
          <span className="text-muted-foreground">Awaiting Approval</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="approved" />
          <span className="text-muted-foreground">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status="declined" />
          <span className="text-muted-foreground">Not Available</span>
        </div>
      </div>
    </div>
  );
}
