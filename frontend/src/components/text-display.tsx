"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TextDisplayProps {
  text: string;
  label: string;
  isPrimary?: boolean;
}

export default function TextDisplay({
  text,
  label,
  isPrimary = true,
}: TextDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardBg = isPrimary ? "bg-slate-800" : "bg-amber-900/30";
  const cardBorder = isPrimary ? "border-slate-700" : "border-amber-700/50";
  const textBoxBg = isPrimary ? "bg-slate-900" : "bg-amber-950/40";
  const textBoxBorder = isPrimary ? "border-slate-700" : "border-amber-700/30";
  const labelColor = isPrimary ? "text-white" : "text-amber-200";

  return (
    <Card className={`${cardBg} border ${cardBorder} p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`${labelColor} font-semibold`}>{label}</h3>
        <Button
          onClick={handleCopy}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </Button>
      </div>
      <div
        className={`${textBoxBg} border ${textBoxBorder} rounded p-4 max-h-96 overflow-y-auto`}
      >
        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </Card>
  );
}
