import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Phone } from "lucide-react";
  
  export function CallDialog({ open, onOpenChange, phone }) {
    const handleCall = () => {
      // Aquí puedes implementar la lógica para realizar la llamada
      // Por ahora solo abriremos el protocolo tel:
      window.location.href = `tel:${phone}`;
      onOpenChange(false);
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Make Call
            </DialogTitle>
          </DialogHeader>
  
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number:
              </label>
              <Input
                id="phone"
                value={phone}
                disabled
                className="bg-muted"
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Click Call to initiate the call using your default phone application.
            </p>
          </div>
  
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleCall}
            >
              Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }