"use client";

import { Wand2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CleanSectionProps {
  onClean: (customPrompt?: string) => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export default function CleanSection({
  onClean,
  isLoading,
  isDisabled,
}: CleanSectionProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomClean = () => {
    if (customPrompt.trim()) {
      onClean(customPrompt);
      setCustomPrompt("");
      setShowCustom(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="w-4 h-4 text-orange-400" />
        <h3 className="text-white font-semibold">Custom Cleaning Prompt</h3>
      </div>

      {!showCustom ? (
        <Button
          onClick={() => setShowCustom(true)}
          disabled={isLoading || isDisabled}
          variant="outline"
          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
        >
          Add Custom Prompt
        </Button>
      ) : (
        <>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isLoading || isDisabled}
            placeholder="E.g., 'Remove all filler words but keep the professional tone...'"
            className="w-full h-20 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 p-2 text-sm resize-none focus:outline-none focus:border-blue-500 mb-3 disabled:opacity-50"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleCustomClean}
              disabled={!customPrompt.trim() || isLoading || isDisabled}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:bg-slate-700"
            >
              Clean with Prompt
            </Button>
            <Button
              onClick={() => {
                setShowCustom(false);
                setCustomPrompt("");
              }}
              disabled={isLoading || isDisabled}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
