import { useState, useRef, useEffect } from "react";
import { Toaster, toast } from "@/components/ui/sonner";
import { Search, Camera, Upload, Plus, Filter, ScanLine, X, Aperture, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Mock inventory data
const inventoryItems = [
  { id: 1, name: "Dell OptiPlex 7090", serialNumber: "DELL-7090-001", category: "Computer", location: "Comp Lab 1", quantity: 30, status: "Good" as const },
  { id: 2, name: "Epson EB-X51 Projector", serialNumber: "EPS-X51-012", category: "Projector", location: "AV Room A", quantity: 2, status: "Good" as const },
  { id: 3, name: "HP LaserJet Pro M404n", serialNumber: "HP-M404-003", category: "Printer", location: "Admin Office", quantity: 3, status: "Maintenance" as const },
  { id: 4, name: "Cisco Catalyst 2960", serialNumber: "CISCO-2960-005", category: "Network", location: "Server Room", quantity: 4, status: "Good" as const },
  { id: 5, name: "Samsung 55\" Display", serialNumber: "SAM-55D-008", category: "Display", location: "Conference Hall A", quantity: 2, status: "Good" as const },
  { id: 6, name: "Logitech C920 Webcam", serialNumber: "LOG-C920-015", category: "Peripheral", location: "IT Storage", quantity: 15, status: "Good" as const },
  { id: 7, name: "APC Smart-UPS 1500VA", serialNumber: "APC-1500-021", category: "Power", location: "Server Room", quantity: 6, status: "Good" as const },
  { id: 8, name: "Whiteboard 4x6ft", serialNumber: "WB-46-030", category: "Furniture", location: "Storage A", quantity: 12, status: "Good" as const },
  { id: 9, name: "Polycom Conference Phone", serialNumber: "POLY-CF-018", category: "Communication", location: "Conference Hall B", quantity: 3, status: "Repair" as const },
  { id: 10, name: "Standing Lectern", serialNumber: "LEC-STD-025", category: "Furniture", location: "Auditorium", quantity: 2, status: "Good" as const },
];

const categories = ["All", "Computer", "Projector", "Printer", "Network", "Display", "Peripheral", "Power", "Furniture", "Communication"];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isOCRDialogOpen, setIsOCRDialogOpen] = useState(false);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<string[]>([]);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [categoryValue, setCategoryValue] = useState("");

  // Handle submit for add item form
  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const itemName = (form.querySelector<HTMLInputElement>("#itemName")?.value) || "(no name)";
    const serial = (form.querySelector<HTMLInputElement>("#serialNumber")?.value) || "(no serial)";
    const qty = (form.querySelector<HTMLInputElement>("#quantity")?.value) || "(no qty)";
    const location = (form.querySelector<HTMLInputElement>("#location")?.value) || "(no location)";
    setIsAddSheetOpen(false);
    toast.success("Item added to inventory");
  };

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartCamera = async () => {
    setOcrError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraOn(true);
    } catch (err) {
      console.error(err);
      setOcrError("Unable to access camera");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try { videoRef.current.pause(); } catch {};
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // Stop camera when the OCR dialog is closed
  useEffect(() => {
    if (!isOCRDialogOpen) {
      stopCamera();
      setIsProcessing(false);
    }
  }, [isOCRDialogOpen]);

  const runOCROnBlob = async (blob: Blob) => {
    setIsProcessing(true);
    setOcrError(null);
    setOcrResult([]);
    try {
      const Tesseract = await import('tesseract.js');
      const res = await Tesseract.recognize(blob as any, 'eng', { logger: (_m: any) => null });
      const text = res?.data?.text ?? '';
      const matches = Array.from(new Set((text.match(/[A-Z0-9\-]{5,}/gi) || []).map(m => m.trim())));
      if (matches.length === 0) {
        const msg = 'No serial number detected';
        setOcrError(msg);
        toast.error(msg);
        setOcrResult([]);
      } else {
        setOcrResult(matches);
      }
    } catch (e) {
      console.error(e);
      setOcrError('OCR failed. Install tesseract.js or try a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const captureFromCamera = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current ?? document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Prepare for OCR
    setOcrResult([]);
    setOcrError(null);

    // Convert canvas to blob
    const blob: Blob | null = await new Promise((resolve) => {
      try {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95);
      } catch (e) {
        console.error('toBlob failed', e);
        resolve(null);
      }
    });

    if (!blob) {
      setOcrError('Capture failed. Please try again.');
      return;
    }

    // Stop camera while processing
    stopCamera();

    // Run OCR using existing helper (this sets isProcessing internally)
    try {
      await runOCROnBlob(blob);
    } catch (e) {
      console.error(e);
      setOcrError('OCR failed. Try a clearer image or use upload.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await runOCROnBlob(file);
  };

  return (
    <div className="space-y-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Inventory Management</h2>
          <p className="text-sm text-muted-foreground">Track and manage physical assets across campus</p>
        </div>
        
        {/* Mobile: Sheet, Desktop: Dialog */}
        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Add Inventory Item</SheetTitle>
            </SheetHeader>
            <form className="space-y-4 mt-6" onSubmit={handleAddItem}>
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" placeholder="Enter item name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" placeholder="Enter serial number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryValue} onValueChange={setCategoryValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(c => c !== "All").map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAddSheetOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search and Filter Bar */}
      <div className="card-neo p-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {/* OCR Scan Button */}
            <Dialog open={isOCRDialogOpen} onOpenChange={setIsOCRDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  <ScanLine className="h-4 w-4" />
                  <span className="hidden sm:inline">Scan OCR</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Aperture className="h-5 w-5 text-primary" />
                    Scan Terminal
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  <p className="text-sm text-muted-foreground">
                    Use your camera or upload an image to scan equipment serial numbers automatically.
                  </p>
                  
                  {/* Camera Viewport */}
                  <div className="relative aspect-video bg-foreground/5 rounded-lg overflow-hidden border border-border">
                    {/* Video element for live camera */}
                    <video ref={videoRef} className={`absolute inset-0 w-full h-full object-cover ${isCameraOn ? '' : 'hidden'}`} />

                    {/* Placeholder / instructions when camera is off */}
                    {!isCameraOn && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <Camera className="h-12 w-12 mb-3 opacity-50" />
                        <p className="text-sm font-medium">Camera Preview</p>
                        <p className="text-xs mt-1">Position serial number in frame</p>
                      </div>
                    )}

                    {/* Processing overlay */}
                    {isProcessing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <style dangerouslySetInnerHTML={{__html: `@keyframes scanMove { from { transform: translateX(-110%); } to { transform: translateX(110%); } } @keyframes dotPulse { 0% { opacity: .2; } 50% { opacity: 1; } 100% { opacity: .2; } }`}} />

                        {/* grid overlay */}
                        <div
                          aria-hidden
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(rgba(0,0,0,0.03) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(0,0,0,0.02) 0 1px, transparent 1px 24px)'
                          }}
                          className="absolute inset-0 opacity-60 rounded-lg"
                        />

                        {/* scan rectangle */}
                        {/* inner scan rectangle removed for better mobile/desktop responsiveness */}

                        {/* scanning text + pulsing dots */}
                        <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span style={{ animation: 'dotPulse 1s infinite' }} className="block h-2 w-2 bg-destructive rounded-full" />
                            <span style={{ animation: 'dotPulse 1s .15s infinite' }} className="block h-2 w-2 bg-destructive rounded-full" />
                            <span style={{ animation: 'dotPulse 1s .3s infinite' }} className="block h-2 w-2 bg-destructive rounded-full" />
                          </div>
                          <div className="text-sm">Scanning for serial number...</div>
                        </div>
                      </div>
                    )}

                    {/* Corner guides */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50 rounded-tr" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50 rounded-bl" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br" />

                    {/* hidden canvas used to capture frame */}
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Button>
                    <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

                    {!isCameraOn ? (
                      <Button 
                        className="flex-1 gap-2"
                        onClick={handleStartCamera}
                        disabled={isProcessing}
                      >
                        <Camera className="h-4 w-4" />
                        {isProcessing ? "Starting..." : "Start Camera"}
                      </Button>
                    ) : (
                      <div className="flex-1 flex gap-2">
                        <Button className="flex-1 gap-2" onClick={async () => { await captureFromCamera(); }} disabled={isProcessing}>
                          <ScanLine className="h-4 w-4" />
                          Capture
                        </Button>
                        <Button variant="ghost" className="w-12" onClick={stopCamera}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* OCR result card (wireframe) */}
                  <div className="space-y-2">
                    {ocrError && <div className="text-sm text-destructive">{ocrError}</div>}

                    {ocrResult.length > 0 ? (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="pointer-events-auto bg-card border border-border shadow-lg rounded-lg p-6 w-[380px] text-center">
                          <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
                            <CheckCircle className="h-6 w-6 text-success" />
                          </div>
                          <p className="text-sm text-muted-foreground">Serial Number Detected</p>
                          <h3 className="text-lg font-semibold text-foreground mt-2 mb-4 font-mono">{ocrResult[0]}</h3>
                          <div className="flex items-center justify-center gap-3">
                            <Button variant="ghost" onClick={async () => { setOcrResult([]); setOcrError(null); await handleStartCamera(); }}>
                              Scan Again
                            </Button>
                            <Button onClick={() => { setSearchQuery(ocrResult[0]); setIsOCRDialogOpen(false); setOcrResult([]); stopCamera(); }} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                              Use This
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className="bg-secondary p-3 rounded text-xs text-muted-foreground">
                      <strong className="text-foreground">Supported formats:</strong> JPG, PNG, HEIC • <strong className="text-foreground">Max size:</strong> 10MB
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 items-center">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop: Table View */}
      <div className="card-neo overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="table-neo w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-4">Item Name</th>
                <th className="text-left px-4 py-4">Serial Number</th>
                <th className="text-left px-4 py-4">Category</th>
                <th className="text-left px-4 py-4">Location</th>
                <th className="!text-center px-4 py-4 w-28">QTY</th> 
                <th className="!text-center px-4 py-4 w-36">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{item.serialNumber}</td>
                  <td className="px-4 py-4 text-muted-foreground">{item.category}</td>
                  <td className="px-4 py-4 text-muted-foreground">{item.location}</td>
                  <td className="px-4 py-4 !text-center font-semibold text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center items-center w-full">
                      <StatusBadge status={item.status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Card View */}
      <div className="space-y-3 md:hidden">
        {filteredItems.map((item) => (
          <div key={item.id} className="card-neo p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{item.serialNumber}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium text-foreground">{item.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Location</p>
                <p className="font-medium text-foreground">{item.location}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-medium text-foreground">{item.quantity}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filteredItems.length} of {inventoryItems.length} items
      </p>
    </div>
  );
}
