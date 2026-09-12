from fastapi import FastAPI
import config

app = FastAPI(title="VeraFi Backend")


@app.get("/")
def read_root():
    return {"message": "VeraFi backend is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
