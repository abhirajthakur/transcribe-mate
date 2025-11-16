# Transcribe Mate

An AI-powered voice transcription and text cleaning application that converts raw audio recordings into clean, well-formatted transcripts. Perfect for meeting notes, interviews, voice memos, and any audio content that needs professional transcript formatting.

## Features

- **Multiple Input Methods**
  - 🎙️ Record audio directly from your microphone
  - 📁 Upload audio files (MP3, WAV, M4A, and more)
  - 📋 Paste existing transcripts for cleaning

- **Local Transcription**
  - Uses Faster Whisper for high-quality, privacy-focused speech-to-text
  - No external API calls for transcription
  - Supports multiple model sizes (base, small, medium, large)
  <!-- - Automatic language detection -->

- **AI-Powered Cleaning**
  - Intelligent transcript refinement using Google Gemini API
  - Removes filler words (um, uh, like, you know, basically, etc.)
  - Fixes grammar and speech-to-text errors
  - Preserves technical details, names, numbers, and action items
  - Customizable cleaning prompts for specific use cases

- **User-Friendly Interface**
  - Clean, modern UI built with Next.js and Tailwind CSS
  - Side-by-side comparison of original and cleaned transcripts
  - One-click copy functionality
  - Responsive design for all devices

## Tech Stack

### Frontend

- **Next.js** - React framework for production
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first styling

### Backend

- **FastAPI** - Modern Python web framework
- **Faster Whispe** - Local speech-to-text model
- **Google GenAI** - Gemini LLM for transcript cleaning
- **Python 3.12** - Backend language

## Prerequisites

- **Node.js** 18+ and npm/bun
- **Python** 3.12+
- **Google Gemini API Key** (for text cleaning)
- **Docker** (optional, for containerized deployment)

## Installation

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies using uv (recommended) or pip:

```bash
# Using uv (faster)
pip install uv
uv pip install -r pyproject.toml

# Or using pip
pip install -e .
```

4. Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash  # Optional, defaults to this
WHISPER_MODEL=base  # Optional: base, small, medium, or large
```

5. Start the backend server:

```bash
uvicorn app:app --reload
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Create a `.env.local` file (optional):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

4. Start the development server:

```bash
npm run dev
# or
bun dev
```

The frontend will run on `http://localhost:3000`

## Docker Deployment

Both frontend and backend include Dockerfiles for containerized deployment.

### Backend Docker

```bash
cd backend
docker build -t transcribe-mate-backend .
docker run -p 8000:8000 --env-file .env transcribe-mate-backend
```

### Frontend Docker

```bash
cd frontend
docker build -t transcribe-mate-frontend .
docker run -p 3000:3000 transcribe-mate-frontend
```

## Usage

1. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000`

2. **Choose an Input Method**
   - **Record**: Click the microphone button to start recording, click stop when done
   - **Upload**: Select an audio file from your computer
   - **Paste**: Copy and paste an existing transcript

3. **Transcribe Audio**
   - For recorded or uploaded audio, the app will automatically transcribe it using Faster Whisper
   - The original transcript will appear in the display area

4. **Clean the Transcript**
   - Review the default cleaning prompt or customize it for your needs
   - Click "Clean Text" to process the transcript with AI
   - Compare the original and cleaned versions side-by-side

## Configuration

### Backend Environment Variables

| Variable         | Description                           | Default            |
| ---------------- | ------------------------------------- | ------------------ |
| `GEMINI_API_KEY` | Your Google Gemini API key (required) | -                  |
| `GEMINI_MODEL`   | Gemini model to use for cleaning      | `gemini-2.5-flash` |
| `WHISPER_MODEL`  | Faster Whisper model size             | `base`             |

### Frontend Environment Variables

| Variable                  | Description     | Default                 |
| ------------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:8000` |

## API Endpoints

### GET `/api/system-prompt`

Retrieves the default system prompt used for transcript cleaning.

**Response:**

```json
{
  "system_prompt": "You are a transcript cleaning assistant..."
}
```

### POST `/api/transcribe`

Uploads an audio file and returns the transcribed text.

**Request:**

- Multipart form data with audio file

**Response:**

```json
{
  success: True,
  "text": "This is the transcribed text...",
}
```

### POST `/api/clean`

Cleans a transcript using AI based on a custom prompt.

**Request:**

```json
{
  "text": "Raw transcript text...",
  "system_prompt": "Custom cleaning instructions..."
}
```

**Response:**

```json
{
  "cleaned": "Cleaned and formatted text..."
}
```
