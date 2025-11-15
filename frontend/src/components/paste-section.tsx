"use client";

import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PasteSectionProps {
  onTranscript: (text: string) => void;
  isDisabled: boolean;
}

export default function PasteSection({
  onTranscript,
  isDisabled,
}: PasteSectionProps) {
  const [pastedText, setPastedText] = useState("");

  const handlePaste = () => {
    if (pastedText.trim()) {
      onTranscript(pastedText);
      setPastedText("");
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <FileText className="w-4 h-4 mr-2 text-purple-400" />
        Paste Transcript
      </h3>
      <textarea
        value={pastedText}
        disabled={isDisabled}
        onChange={(e) => setPastedText(e.target.value)}
        placeholder="Paste your transcript here..."
        className="w-full h-24 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 p-2 text-sm resize-none focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <Button
        onClick={handlePaste}
        disabled={!pastedText.trim() || isDisabled}
        className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white disabled:bg-slate-700 disabled:text-slate-400"
      >
        <FileText className="w-4 h-4 mr-2" />
        {isDisabled ? "Processing..." : "Load Transcript"}
      </Button>
    </Card>
  );
}
