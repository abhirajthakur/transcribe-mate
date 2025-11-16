"use client";

import { Wand2 } from "lucide-react";
import { useEffect, useState } from "react";
import CleanSection from "@/components/clean-section";
import PasteSection from "@/components/paste-section";
import RecordingSection from "@/components/recording-section";
import TextDisplay from "@/components/text-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UploadSection from "@/components/upload-section";
import { BACKEND_URL } from "@/lib/config";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [cleanedTranscript, setCleanedTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [error, setError] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  useEffect(() => {
    console.log("CLICKED");
    const fetchSystemPrompt = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/system-prompt`);
        if (response.ok) {
          const data = await response.json();
          setSystemPrompt(data.default_prompt || "");
        }
      } catch (err) {
        console.error("Failed to fetch system prompt:", err);
      }
    };

    fetchSystemPrompt();
  }, []);

  const handleTranscript = (text: string) => {
    setTranscript(text);
    setCleanedTranscript("");
    setError("");
  };

  const handleTranscribingState = (loading: boolean) => {
    setIsTranscribing(loading);
  };

  const handleClean = async (customPrompt?: string) => {
    if (!transcript.trim()) {
      setError("No transcript to clean");
      return;
    }

    setIsCleaning(true);
    setError("");

    try {
      const payload: { text: string; system_prompt?: string } = {
        text: transcript,
      };
      if (customPrompt) {
        payload.system_prompt = customPrompt;
      }

      const response = await fetch(`${BACKEND_URL}/api/clean`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Cleaning failed");
      }

      const data = await response.json();
      setCleanedTranscript(data.cleaned);
    } catch (err) {
      setError("Failed to clean transcript");
      console.error(err);
    } finally {
      setIsCleaning(false);
    }
  };

  const isDisabled = isTranscribing || isCleaning;

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Transcribe Mate
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            AI-powered voice transcription with intelligent cleaning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Sections */}
          <div className="lg:col-span-1 space-y-4">
            <RecordingSection
              onTranscript={handleTranscript}
              onTranscribingState={handleTranscribingState}
              isDisabled={isDisabled}
            />
            <UploadSection
              onTranscript={handleTranscript}
              onTranscribingState={handleTranscribingState}
              isDisabled={isDisabled}
            />
            <PasteSection
              onTranscript={handleTranscript}
              isDisabled={isDisabled}
            />
          </div>

          {/* Transcript Display & Controls */}
          <div className="lg:col-span-2 space-y-4">
            {transcript && (
              <>
                {/* Original Transcript */}
                <TextDisplay text={transcript} label="Original Transcript" />

                <Button
                  onClick={() => handleClean()}
                  disabled={isCleaning || isTranscribing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isCleaning ? "Cleaning..." : "Clean Transcript"}
                </Button>

                <CleanSection
                  onClean={handleClean}
                  isLoading={isCleaning}
                  isDisabled={isDisabled}
                  systemPrompt={systemPrompt}
                />

                {/* Cleaned Transcript - appears after cleaning */}
                {cleanedTranscript && (
                  <TextDisplay
                    text={cleanedTranscript}
                    label="Cleaned Transcript"
                    isPrimary={false}
                  />
                )}
              </>
            )}

            {error && (
              <Card className="bg-red-900/20 border-red-700 p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </Card>
            )}

            {!transcript && (
              <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
                <p className="text-slate-400">
                  Start by recording audio, uploading a file, or pasting a
                  transcript
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
