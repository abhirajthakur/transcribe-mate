"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";

interface UploadSectionProps {
  onTranscript: (text: string) => void;
  onTranscribingState: (loading: boolean) => void;
  isDisabled: boolean;
}

export default function UploadSection({
  onTranscript,
  onTranscribingState,
  isDisabled,
}: UploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onTranscribingState(true);

    const formData = new FormData();
    formData.append("audio", file);

    try {
      const response = await fetch(`${BACKEND_URL}/api/transcribe`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Transcription failed");
      }
      const data = await response.json();
      onTranscript(data.text);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      onTranscribingState(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <Upload className="w-4 h-4 mr-2 text-green-400" />
        Upload Audio
      </h3>
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={isDisabled}
        className="hidden"
      />
      <Button
        onClick={() => inputRef.current?.click()}
        disabled={isDisabled}
        className="w-full bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-700 disabled:text-slate-400"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isDisabled ? "Processing..." : "Choose File"}
      </Button>
      <p className="text-slate-400 text-xs mt-2">MP3, WAV, M4A, etc.</p>
    </Card>
  );
}
