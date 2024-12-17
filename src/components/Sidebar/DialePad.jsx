//src/components/Sidebar/DialerPad.jsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useCompanyTheme from '@/store/useCompanyTheme';
import { Phone, X } from "lucide-react";

const DialerButton = ({ number, letters, onClick }) => (
  <div className="relative flex flex-col items-center">
    <button
      onClick={() => onClick(number)}
      className="w-12 h-12 rounded-full flex flex-col items-center justify-center bg-white hover:bg-slate-200 transition-colors relative"
    >
      <span className={`font-medium text-xl mb-4 ${number === '*' ? 'text-3xl' : ''}`}>
        {number}
      </span>
      {letters && (
        <span className="absolute bottom-3 text-[9px] text-slate-500 tracking-wider">
          {letters}
        </span>
      )}
    </button>
  </div>
);

const DialerPad = () => {
  const [number, setNumber] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useCompanyTheme();

  const buttons = [
    { number: "1", letters: "" },
    { number: "2", letters: "ABC" },
    { number: "3", letters: "DEF" },
    { number: "4", letters: "GHI" },
    { number: "5", letters: "JKL" },
    { number: "6", letters: "MNO" },
    { number: "7", letters: "PQRS" },
    { number: "8", letters: "TUV" },
    { number: "9", letters: "WXYZ" },
    { number: "*", letters: "" },
    { number: "0", letters: "+" },
    { number: "#", letters: "" },
  ];

  const handleNumberClick = (value) => {
    if (number.length < 15) {
      setNumber(prev => prev + value);
    }
  };

  const handleDelete = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number) {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="mt-4">
      {/* Display Number */}
      <div className="px-4 mb-4">
        <div className="relative h-10 flex items-center justify-between border-b border-slate-200">
          <p className="text-lg font-mono tracking-wider flex-1 text-center">
            {number}
          </p>
          {number && (
            <button
              onClick={handleDelete}
              className="absolute right-0 flex items-center justify-center h-6"
            >
              <div className="relative flex items-center h-[22px] bg-black/80 hover:bg-black">
                {/* X dentro del rectángulo */}
                <div className="px-2">
                  <X className="h-3 w-3 text-white" />
                </div>
                {/* Forma triangular derecha */}
                <div className="absolute -left-[11px] h-full w-[11px] overflow-hidden">
                  <div className="absolute left-0 h-full w-[22px] bg-black/80 hover:bg-black transform -rotate-45"></div>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Dialer Grid */}
      <div className="grid grid-cols-3 gap-3 px-4">
        {buttons.map((btn) => (
          <DialerButton
            key={btn.number}
            number={btn.number}
            letters={btn.letters}
            onClick={handleNumberClick}
          />
        ))}
      </div>

      {/* Call Button */}
      <div className="px-4 mt-4">
        <button
          onClick={handleCall}
          disabled={!number}
          className="w-full h-12 rounded-full flex items-center justify-center gap-2 transition-colors"
          style={{ 
            backgroundColor: number ? theme.base1 : 'white',
            color: number ? 'white' : 'rgb(100, 116, 139)'
          }}
        >
          <Phone className="h-4 w-4" />
          <span>Call</span>
        </button>
      </div>

      {/* Calling Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[300px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 text-green-500 animate-pulse" />
                <span>Calling to: {number}</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <Button
              variant="destructive"
              onClick={() => setIsDialogOpen(false)}
              className="rounded-full"
            >
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialerPad;