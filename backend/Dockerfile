FROM python:3.9-slim

WORKDIR /app

# Prevent Python from writing .pyc files and keep stdout/stderr unbuffered
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Alembic configuration, migrations, and application code
COPY alembic.ini .
COPY migrations/ migrations/
COPY app/ app/

# Expose default backend port
EXPOSE 8000

# Execute database migrations before starting the FastAPI server
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
