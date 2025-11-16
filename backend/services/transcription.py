import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from faster_whisper import WhisperModel
from google import genai
from google.genai import types

PROMPT_FILE = Path(__file__).parent.parent / "system_prompt.txt"
SYSTEM_PROMPT = PROMPT_FILE.read_text().strip()

load_dotenv()


class TranscriptionService:
    def __init__(self, gemini_api_key: str, gemini_model: str, whisper_model: str):
        self.client = genai.Client(api_key=gemini_api_key)
        self.model = gemini_model
        self.whisper = WhisperModel(whisper_model, device="auto", compute_type="int16")

        try:
            self.client.models.list()
            print("Connected to LLM API!")
        except Exception as e:
            print(f"Warning: Could not connect to LLM: {e}")

    def transcribe(self, audio_file: str):
        print("Transcribing...")
        segments, info = self.whisper.transcribe(audio_file, beam_size=5)

        print(
            "Detected language '%s' with probability %f"
            % (info.language, info.language_probability)
        )

        text = " ".join([segment.text for segment in segments]).strip()

        return text

    def get_default_system_prompt(self):
        return SYSTEM_PROMPT

    def clean_with_llm(
        self, text: str, custom_system_prompt: Optional[str] = None
    ) -> str:
        if custom_system_prompt:
            prompt_to_use = custom_system_prompt
        else:
            prompt_to_use = SYSTEM_PROMPT

        print("Cleaning with LLM...")

        try:
            response = self.client.models.generate_content(
                model=self.model,
                config=types.GenerateContentConfig(system_instruction=prompt_to_use),
                contents=text,
            )
            if response.text:
                return response.text

            print("Cleaned with LLM!!")
            return text

        except Exception as e:
            print(f"LLM error: {e}")
            return text


def get_transcription_service() -> TranscriptionService:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_NAME = os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"
    WHISPER_MODEL = os.getenv("WHISPER_MODEL") or "base"

    if not GEMINI_API_KEY:
        print("Please provide GEMINI_API_KEY")
        raise EnvironmentError(
            "Required environment variable 'GEMINI_API_KEY' is not set."
        )

    return TranscriptionService(
        gemini_api_key=GEMINI_API_KEY,
        gemini_model=MODEL_NAME,
        whisper_model=WHISPER_MODEL,
    )
