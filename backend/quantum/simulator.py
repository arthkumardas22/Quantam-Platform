"""
Qiskit Aer Quantum Simulator Core
Calculates real quantum simulation results, statevectors, and Bloch vectors.
"""

import time
import math
import numpy as np
from typing import Dict, Any, Tuple
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, partial_trace, Pauli
from qiskit_aer import AerSimulator
from circuit_parser import parse_circuit_json


def simulate_qiskit_circuit(circuit_dict: Dict[str, Any], backend_name: str = "qiskit_aer", shots: int = 1024) -> Dict[str, Any]:
    start_time = time.perf_counter()
    num_qubits = int(circuit_dict.get("numQubits", 2))
    
    # Parse circuit
    qc = parse_circuit_json(circuit_dict)
    
    # 1. Statevector computation (without measurement collapse)
    qc_unitary = qc.remove_final_measurements(inplace=False)
    sv = Statevector.from_instruction(qc_unitary)
    sv_data = sv.data  # complex numpy array
    
    dim = 2 ** num_qubits
    probabilities: Dict[str, float] = {}
    amplitudes_list = []
    
    for i in range(dim):
        basis_state = bin(i)[2:].zfill(num_qubits)
        amp = sv_data[i]
        re = float(np.real(amp))
        im = float(np.imag(amp))
        prob = float(re * re + im * im)
        phase = float(np.arctan2(im, re))
        
        if prob > 0.00001:
            probabilities[basis_state] = round(prob, 4)
            
        amplitudes_list.append({
            "basisState": basis_state,
            "index": i,
            "amplitude": {"re": round(re, 4), "im": round(im, 4)},
            "probability": round(prob, 4),
            "phase": round(phase, 4)
        })
        
    # 2. Shot Sampling with AerSimulator
    qc_measure = qc.copy()
    if not any(instr.operation.name == "measure" for instr in qc_measure.data):
        qc_measure.measure_all()
        
    simulator = AerSimulator()
    job = simulator.run(qc_measure, shots=shots)
    result = job.result()
    raw_counts = result.get_counts()
    
    counts: Dict[str, int] = {}
    for k, v in raw_counts.items():
        # Remove spaces if Qiskit creates segmented bitstrings
        clean_k = k.replace(" ", "")
        counts[clean_k] = v
        
    # 3. Bloch Sphere Coordinates via Partial Trace
    bloch_spheres: Dict[int, Dict[str, float]] = {}
    
    for q in range(num_qubits):
        # Trace out all qubits except q
        other_qubits = [i for i in range(num_qubits) if i != q]
        if other_qubits:
            rho_q = partial_trace(sv, other_qubits).data
        else:
            rho_q = np.outer(sv_data, np.conj(sv_data))
            
        # Pauli expectation values
        x = float(2 * np.real(rho_q[0, 1]))
        y = float(-2 * np.imag(rho_q[0, 1]))
        z = float(np.real(rho_q[0, 0] - rho_q[1, 1]))
        
        r = math.sqrt(x * x + y * y + z * z)
        clamped_z = max(-1.0, min(1.0, z / r if r > 0 else 0.0))
        theta = math.acos(clamped_z)
        phi = math.atan2(y, x)
        if phi < 0:
            phi += 2 * math.pi
            
        bloch_spheres[q] = {
            "x": round(x, 3),
            "y": round(y, 3),
            "z": round(z, 3),
            "theta": round(theta, 3),
            "phi": round(phi, 3)
        }
        
    execution_time_ms = max(1, int((time.perf_counter() - start_time) * 1000))
    
    return {
        "executionId": f"qiskit_{int(time.time() * 1000)}",
        "backend": "Qiskit Aer Simulator (Real Backend)",
        "shots": shots,
        "executionTimeMs": execution_time_ms,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "probabilities": probabilities,
        "counts": counts,
        "stateVector": {
            "numQubits": num_qubits,
            "amplitudes": amplitudes_list
        },
        "blochSpheres": bloch_spheres,
        "success": True
    }
