"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TextDisplayProps {
  text: string;
  isCleanedVersion: boolean;
  originalExists: boolean;
  onToggleVersion: () => void;
}

export default function TextDisplay({
  text,
  isCleanedVersion,
  originalExists,
  onToggleVersion,
}: TextDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">
          {isCleanedVersion ? "Cleaned Transcript" : "Original Transcript"}
        </h3>
        <div className="flex gap-2">
          {originalExists && (
            <Button
              onClick={onToggleVersion}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {isCleanedVersion ? "Show Original" : "Show Cleaned"}
            </Button>
          )}
          <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="bg-slate-900 border border-slate-700 rounded p-4 max-h-96 overflow-y-auto">
        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </Card>
  );
}
