"use client";

import { Wand2, X } from "lucide-react";
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

  const handleCancel = () => {
    setShowCustom(false);
    setCustomPrompt("");
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      {!showCustom ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Wand2 className="w-4 h-4 text-orange-400" />
            <h3 className="text-white font-semibold">Custom Cleaning Prompt</h3>
          </div>
          <Button
            onClick={() => setShowCustom(true)}
            disabled={isLoading || isDisabled}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
          >
            Add Custom Prompt
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-orange-400" />
              Custom Cleaning Prompt
            </h3>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
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
              onClick={handleCancel}
              disabled={isLoading || isDisabled}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
