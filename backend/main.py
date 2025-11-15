import os
import tempfile

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from services import transcription


class CleanRequest(BaseModel):
    text: str
    system_prompt: str | None = None


app = FastAPI(title="transcribe-mate")


@app.get("/api/system-prompt")
async def get_system_prompt(
    service: transcription.TranscriptionService = Depends(
        transcription.get_transcription_service
    ),
):
    return {"default_prompt": service.get_default_system_prompt()}


@app.post("/api/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    service: transcription.TranscriptionService = Depends(
        transcription.get_transcription_service
    ),
):
    filename = audio.filename
    if filename:
        suffix = os.path.splitext(filename)[1] or ".webm"
    else:
        suffix = ".webm"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        raw_text = service.transcribe(tmp_path)
        return {"success": True, "text": raw_text}

    except Exception as e:
        print(f"Transcription error: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

    finally:
        # temp file clean up
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.post("/api/clean")
async def clean_text(
    request: CleanRequest,
    service: transcription.TranscriptionService = Depends(
        transcription.get_transcription_service
    ),
):
    try:
        return StreamingResponse(
            service.clean_with_llm_stream(
                request.text, custom_system_prompt=request.system_prompt
            ),
            media_type="text/plain",
        )

    except Exception as e:
        print(f"LLM cleaning error: {e}")
        raise HTTPException(status_code=500, detail=f"Cleaning failed: {str(e)}")
