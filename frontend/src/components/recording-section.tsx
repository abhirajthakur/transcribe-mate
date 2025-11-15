"use client";

import { Mic, Square } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BACKEND_URL } from "@/lib/config";
import { cn } from "@/lib/utils";

interface RecordingSectionProps {
  onTranscript: (text: string) => void;
  onTranscribingState: (loading: boolean) => void;
  isDisabled: boolean;
}

export default function RecordingSection({
  onTranscript,
  onTranscribingState,
  isDisabled,
}: RecordingSectionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => {
          track.stop();
        });
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onTranscribingState(true);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", blob);

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
      console.error("Transcription error:", err);
    } finally {
      onTranscribingState(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <h3 className="text-white font-semibold mb-3 flex items-center">
        <Mic className="w-4 h-4 mr-2 text-blue-400" />
        Record Audio
      </h3>
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isDisabled && !isRecording}
        className={cn("w-full bg-blue-600 hover:bg-blue-700 text-white", {
          "bg-red-600 hover:bg-red-700": isRecording,
        })}
      >
        {isRecording ? (
          <>
            <Square className="w-4 h-4 mr-2 fill-current" />
            Stop Recording
          </>
        ) : isDisabled ? (
          "Transcribing..."
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </>
        )}
      </Button>
      {isRecording && (
        <p className="text-red-400 text-xs mt-2 animate-pulse">
          ● Recording...
        </p>
      )}
    </Card>
  );
}
