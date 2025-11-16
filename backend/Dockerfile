FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:0.8.22 /uv /bin/

COPY . /app
WORKDIR /app

RUN uv sync --frozen --no-cache

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 80
CMD ["/app/.venv/bin/fastapi", "run", "app.py", "--port", "80", "--host", "0.0.0.0"]
