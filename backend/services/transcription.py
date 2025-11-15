import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from google import genai
from google.genai import types

PROMPT_FILE = Path(__file__).parent.parent / "system_prompt.txt"
SYSTEM_PROMPT = PROMPT_FILE.read_text().strip()

load_dotenv()


class TranscriptionService:
    def __init__(self, gemini_api_key: str, gemini_model: str):
        print(f"Loading gemini with model '{gemini_model}'...")
        self.client = genai.Client(api_key=gemini_api_key)
        self.model = gemini_model
        print(f"gemini '{gemini_model}' loaded!")

        try:
            self.client.models.list()
            print("Connected to LLM API!")
        except Exception as e:
            print(f"Warning: Could not connect to LLM: {e}")

    def transcribe(self, audio_file: str):
        print("Transcribing...")
        file = self.client.files.upload(file=audio_file)
        prompt = "Generate a transcript of the speech."

        response = self.client.models.generate_content(
            model=self.model, contents=[prompt, file]
        )
        return response.text

    def get_default_system_prompt(self):
        return SYSTEM_PROMPT

    def clean_with_llm_stream(
        self, text: str, custom_system_prompt: Optional[str] = None
    ):
        if custom_system_prompt:
            prompt_to_use = custom_system_prompt
        else:
            prompt_to_use = SYSTEM_PROMPT

        print("Cleaning with LLM...")

        try:
            response = self.client.models.generate_content_stream(
                model=self.model,
                config=types.GenerateContentConfig(system_instruction=prompt_to_use),
                contents=text,
            )

            for chunk in response:
                if chunk.text:
                    yield chunk.text

        except Exception as e:
            print(f"LLM streaming error: {e}")
            yield text


def get_transcription_service() -> TranscriptionService:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    MODEL_NAME = os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"

    if not GEMINI_API_KEY:
        print("Please provide GEMINI_API_KEY")
        raise EnvironmentError(
            "Required environment variable 'GEMINI_API_KEY' is not set."
        )

    return TranscriptionService(gemini_api_key=GEMINI_API_KEY, gemini_model=MODEL_NAME)
