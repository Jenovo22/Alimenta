# ---- Frontend build stage ----
FROM node:22-alpine AS frontend-builder
WORKDIR /web
COPY ./app/frontend/package*.json ./
RUN npm ci --no-audit --no-fund || npm install --no-audit --no-fund
COPY ./app/frontend ./
RUN npm run build

# ---- Backend build stage ----
FROM python:3.11-slim AS builder
WORKDIR /code
COPY ./requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ---- Runtime stage ----
FROM python:3.11-slim
WORKDIR /code
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . /code
COPY --from=frontend-builder /web/dist /code/app/frontend/dist
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]