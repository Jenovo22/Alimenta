from fastapi import FastAPI

app = FastAPI(title="Alimenta Backend")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
