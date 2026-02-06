# Use the official Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /app
RUN apt-get update && apt-get install -y curl xz-utils
# Install system dependencies (for uv)
#RUN apt-get update && apt-get install -y curl

# Install Typst
RUN curl -L -o typst.tar.xz https://github.com/typst/typst/releases/download/v0.11.0/typst-x86_64-unknown-linux-musl.tar.xz \
    && tar -xf typst.tar.xz \
    && mv typst-x86_64-unknown-linux-musl/typst /usr/local/bin/ \
    && rm -rf typst.tar.xz typst-x86_64-unknown-linux-musl

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy project definition
COPY pyproject.toml uv.lock ./

# Install Python dependencies
RUN uv sync --frozen

# Copy the SOURCE code
COPY src/ ./src/

# Run the application (Notice "src.main:app")
CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]