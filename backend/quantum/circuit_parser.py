"""
Quantum Circuit Parser
Converts structured JSON circuit data into valid Qiskit QuantumCircuit instances.
Prevents arbitrary Python code execution through safe deterministic parsing.
"""

import math
from typing import Dict, Any, List
from qiskit import QuantumCircuit


def parse_circuit_json(data: Dict[str, Any]) -> QuantumCircuit:
    num_qubits = int(data.get("numQubits", 2))
    gates: List[Dict[str, Any]] = data.get("gates", [])

    # Sort gates chronologically by time step column
    sorted_gates = sorted(gates, key=lambda g: g.get("column", 0))

    qc = QuantumCircuit(num_qubits, num_qubits)

    for g in sorted_gates:
        gate_type = g.get("type", "").upper()
        target = int(g.get("targetQubit", 0))
        control = int(g.get("controlQubit", 0)) if "controlQubit" in g else None
        second_control = int(g.get("secondControlQubit", 0)) if "secondControlQubit" in g else None
        swap_target = int(g.get("swapTargetQubit", 0)) if "swapTargetQubit" in g else None
        parameter = float(g.get("parameter", math.pi / 2)) if "parameter" in g else math.pi / 2

        if gate_type == "H":
            qc.h(target)
        elif gate_type == "X":
            qc.x(target)
        elif gate_type == "Y":
            qc.y(target)
        elif gate_type == "Z":
            qc.z(target)
        elif gate_type == "S":
            qc.s(target)
        elif gate_type == "T":
            qc.t(target)
        elif gate_type == "RX":
            qc.rx(parameter, target)
        elif gate_type == "RY":
            qc.ry(parameter, target)
        elif gate_type == "RZ":
            qc.rz(parameter, target)
        elif gate_type in ("CNOT", "CX"):
            c = control if control is not None else max(0, target - 1)
            qc.cx(c, target)
        elif gate_type == "CZ":
            c = control if control is not None else max(0, target - 1)
            qc.cz(c, target)
        elif gate_type == "SWAP":
            other = swap_target if swap_target is not None else (target + 1) % num_qubits
            qc.swap(target, other)
        elif gate_type == "CCX":
            c1 = control if control is not None else 0
            c2 = second_control if second_control is not None else 1
            qc.ccx(c1, c2, target)
        elif gate_type == "M":
            qc.measure(target, target)
        elif gate_type == "BARRIER":
            qc.barrier()

    return qc
