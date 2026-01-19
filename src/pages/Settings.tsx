import { User, Bell, Shield, Database, Info, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage system preferences and configurations</p>
      </div>

      {/* Profile Settings */}
      <div className="card-neo overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3 border-b border-border bg-secondary/50">
          <div className="p-1.5 bg-card rounded border border-border">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Profile Settings</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Juan Dela Cruz" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="jdelacruz@pup.edu.ph" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" defaultValue="Information Technology" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue="System Administrator" disabled className="bg-muted" />
            </div>
          </div>
          <div className="pt-2">
            <Button className="shadow-sm">Save Changes</Button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card-neo overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3 border-b border-border bg-secondary/50">
          <div className="p-1.5 bg-card rounded border border-border">
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Email Notifications</p>
              <p className="text-xs text-muted-foreground mt-0.5">Receive email alerts for reservation updates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Low Stock Alerts</p>
              <p className="text-xs text-muted-foreground mt-0.5">Get notified when inventory items are running low</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-foreground">Pending Approval Reminders</p>
              <p className="text-xs text-muted-foreground mt-0.5">Daily digest of pending reservation requests</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card-neo overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3 border-b border-border bg-secondary/50">
          <div className="p-1.5 bg-card rounded border border-border">
            <Shield className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Security</h3>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <div className="pt-2">
            <Button className="shadow-sm">Update Password</Button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="card-neo overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-3 border-b border-border bg-secondary/50">
          <div className="p-1.5 bg-card rounded border border-border">
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">System Information</h3>
        </div>
        <div className="p-5 space-y-3 text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">System Version</span>
            <span className="font-mono text-foreground bg-secondary px-2 py-0.5 rounded text-xs">v1.0.0</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="text-foreground">January 19, 2026</span>
          </div>
          <div className="border-t border-border" />
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Database Status</span>
            <span className="flex items-center gap-1.5 text-status-approved">
              <Check className="h-3.5 w-3.5" />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
