import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings, HelpCircle, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function ProfileDropdown() {
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("User signed out");
    setShowSignOutDialog(false);
    toast.success('Signed out successfully');
    // navigate to login or home - adjust as needed
    try { navigate('/login'); } catch {}
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 px-2 py-1.5 h-auto hover:bg-muted/80 rounded transition-all"
          >
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center ring-2 ring-primary/20">
              <span className="text-xs font-semibold text-primary">JD</span>
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-medium text-foreground leading-tight">John Doe</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Administrator</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-card border border-border shadow-lg rounded-lg p-1"
          sideOffset={8}
        >
          <DropdownMenuLabel className="px-3 py-2">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">john.doe@pup.edu.ph</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded hover:bg-muted focus:bg-muted transition-colors"
            onClick={() => navigate('/settings')}
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded hover:bg-muted focus:bg-muted transition-colors"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded hover:bg-muted focus:bg-muted transition-colors"
            onClick={() => navigate('/settings')}
          >
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border" />
          <DropdownMenuItem 
            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded hover:bg-destructive/10 focus:bg-destructive/10 text-destructive transition-colors"
            onClick={() => setShowSignOutDialog(true)}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <AlertDialogContent className="sm:max-w-[400px] bg-card border border-border shadow-xl rounded-lg p-0 overflow-hidden">
          <div className="p-6 pb-4">
            <AlertDialogHeader className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="h-6 w-6 text-destructive" />
              </div>
              <AlertDialogTitle className="text-center text-lg font-semibold text-foreground">
                Sign Out
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-sm text-muted-foreground">
                Are you sure you want to sign out? You'll need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter className="bg-muted/30 px-6 py-4 flex flex-row gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1 m-0 bg-card border border-border hover:bg-muted text-foreground font-medium">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSignOut}
              className="flex-1 m-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
