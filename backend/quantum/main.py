"""
FastAPI Quantum Service
Exposes Qiskit Aer simulations and Bloch vector endpoints via HTTP.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import uvicorn

from simulator import simulate_qiskit_circuit

app = FastAPI(
    title="QuantamStudio Quantum Simulator Service",
    version="1.0.0",
    description="Qiskit Aer Quantum Execution Engine for SIH 26140"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SimulationRequest(BaseModel):
    circuit: Dict[str, Any]
    backend: Optional[str] = "qiskit_aer"
    shots: Optional[int] = Field(default=1024, ge=1, le=10000)


@app.get("/health")
def health():
    return {
        "status": "online",
        "service": "Qiskit Aer Simulator Service",
        "qiskit_version": "1.0+",
    }


@app.post("/simulate")
def simulate(req: SimulationRequest):
    try:
        result = simulate_qiskit_circuit(req.circuit, req.backend or "qiskit_aer", req.shots or 1024)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/statevector")
def statevector(req: SimulationRequest):
    try:
        result = simulate_qiskit_circuit(req.circuit, "qiskit_aer", 1)
        return result.get("stateVector", {})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/bloch-sphere")
def bloch_sphere(req: SimulationRequest):
    try:
        result = simulate_qiskit_circuit(req.circuit, "qiskit_aer", 1)
        return result.get("blochSpheres", {})
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
