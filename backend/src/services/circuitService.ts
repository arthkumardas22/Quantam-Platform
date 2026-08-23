import { prisma } from '../config/db';
import { CircuitState, PlacedGate } from '../types';
import { SaveCircuitInput } from '../validators/circuitValidator';

export async function createCircuit(userId: string, input: SaveCircuitInput) {
  const generatedCode = generateAllFrameworkCodes(input.circuit);

  return prisma.quantumCircuit.create({
    data: {
      userId,
      name: input.name,
      numQubits: input.circuit.numQubits,
      numColumns: input.circuit.numColumns || 8,
      circuitData: input.circuit.gates as any,
      generatedCode: generatedCode as any,
      isPublic: input.isPublic || false,
    },
  });
}

export async function getUserCircuits(userId: string) {
  const circuits = await prisma.quantumCircuit.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });

  return circuits.map((c) => ({
    id: c.id,
    name: c.name,
    numQubits: c.numQubits,
    numColumns: c.numColumns,
    circuit: {
      numQubits: c.numQubits,
      numColumns: c.numColumns,
      gates: c.circuitData as unknown as PlacedGate[],
    },
    generatedCode: c.generatedCode,
    isPublic: c.isPublic,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
}

export async function getCircuitById(id: string, userId?: string) {
  const circuit = await prisma.quantumCircuit.findUnique({
    where: { id },
  });

  if (!circuit) {
    const error: any = new Error('Circuit not found.');
    error.status = 404;
    error.code = 'CIRCUIT_NOT_FOUND';
    throw error;
  }

  if (!circuit.isPublic && circuit.userId !== userId) {
    const error: any = new Error('Unauthorized to view this private circuit.');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  return {
    id: circuit.id,
    name: circuit.name,
    numQubits: circuit.numQubits,
    numColumns: circuit.numColumns,
    circuit: {
      numQubits: circuit.numQubits,
      numColumns: circuit.numColumns,
      gates: circuit.circuitData as unknown as PlacedGate[],
    },
    generatedCode: circuit.generatedCode,
    isPublic: circuit.isPublic,
    userId: circuit.userId,
    createdAt: circuit.createdAt,
    updatedAt: circuit.updatedAt,
  };
}

export async function updateCircuit(id: string, userId: string, input: SaveCircuitInput) {
  const existing = await getCircuitById(id, userId);

  if (existing.userId !== userId) {
    const error: any = new Error('Cannot modify a circuit owned by another user.');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  const generatedCode = generateAllFrameworkCodes(input.circuit);

  return prisma.quantumCircuit.update({
    where: { id },
    data: {
      name: input.name,
      numQubits: input.circuit.numQubits,
      numColumns: input.circuit.numColumns || 8,
      circuitData: input.circuit.gates as any,
      generatedCode: generatedCode as any,
      isPublic: input.isPublic ?? existing.isPublic,
    },
  });
}

export async function deleteCircuit(id: string, userId: string) {
  const existing = await getCircuitById(id, userId);

  if (existing.userId !== userId) {
    const error: any = new Error('Cannot delete a circuit owned by another user.');
    error.status = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  await prisma.quantumCircuit.delete({
    where: { id },
  });

  return { message: 'Circuit deleted successfully.' };
}

// ─── CODE GENERATORS ──────────────────────────────────────────────────────────

export function generateQiskitCode(circuit: CircuitState): string {
  const sortedGates = [...circuit.gates].sort((a, b) => a.column - b.column);
  const numQ = circuit.numQubits;

  let code = `"""
Generated with QuantamStudio_Bigslayers AI Platform
Qiskit Quantum Circuit Implementation
"""
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator
import matplotlib.pyplot as plt

# Initialize Quantum Circuit with ${numQ} qubit${numQ > 1 ? 's' : ''}
qc = QuantumCircuit(${numQ}, ${numQ})
\n`;

  if (sortedGates.length === 0) {
    code += '# No gates added yet.\n';
    return code;
  }

  let hasMeasurement = false;

  for (const g of sortedGates) {
    switch (g.type) {
      case 'H':
        code += `qc.h(${g.targetQubit})\n`;
        break;
      case 'X':
        code += `qc.x(${g.targetQubit})\n`;
        break;
      case 'Y':
        code += `qc.y(${g.targetQubit})\n`;
        break;
      case 'Z':
        code += `qc.z(${g.targetQubit})\n`;
        break;
      case 'S':
        code += `qc.s(${g.targetQubit})\n`;
        break;
      case 'T':
        code += `qc.t(${g.targetQubit})\n`;
        break;
      case 'Rx':
        code += `qc.rx(${g.parameter?.toFixed(4) || '3.1415/2'}, ${g.targetQubit})\n`;
        break;
      case 'Ry':
        code += `qc.ry(${g.parameter?.toFixed(4) || '3.1415/2'}, ${g.targetQubit})\n`;
        break;
      case 'Rz':
        code += `qc.rz(${g.parameter?.toFixed(4) || '3.1415/2'}, ${g.targetQubit})\n`;
        break;
      case 'CNOT':
        code += `qc.cx(${g.controlQubit ?? 0}, ${g.targetQubit})\n`;
        break;
      case 'CZ':
        code += `qc.cz(${g.controlQubit ?? 0}, ${g.targetQubit})\n`;
        break;
      case 'SWAP':
        code += `qc.swap(${g.targetQubit}, ${g.swapTargetQubit ?? (g.targetQubit + 1) % numQ})\n`;
        break;
      case 'CCX':
        code += `qc.ccx(${g.controlQubit ?? 0}, ${g.secondControlQubit ?? 1}, ${g.targetQubit})\n`;
        break;
      case 'BARRIER':
        code += `qc.barrier()\n`;
        break;
      case 'M':
        code += `qc.measure(${g.targetQubit}, ${g.targetQubit})\n`;
        hasMeasurement = true;
        break;
    }
  }

  if (!hasMeasurement) {
    code += `\n# Measure all qubits to classical registers\nqc.measure_all()\n`;
  }

  code += `\n# Execute simulation on Qiskit Aer backend
simulator = AerSimulator()
compiled_circuit = simulator.run(qc, shots=1024)
result = compiled_circuit.result()
counts = result.get_counts()

print("Measurement Counts:", counts)
`;

  return code;
}

export function generateCirqCode(circuit: CircuitState): string {
  const sortedGates = [...circuit.gates].sort((a, b) => a.column - b.column);
  const numQ = circuit.numQubits;

  let code = `"""
Generated with QuantamStudio_Bigslayers AI Platform
Google Cirq Quantum Circuit Implementation
"""
import cirq

# Create ${numQ} LineQubits
qubits = [cirq.LineQubit(i) for i in range(${numQ})]
circuit = cirq.Circuit()

# Gate Operations
`;

  for (const g of sortedGates) {
    const t = `qubits[${g.targetQubit}]`;
    const c = g.controlQubit !== undefined ? `qubits[${g.controlQubit}]` : `qubits[0]`;
    switch (g.type) {
      case 'H':
        code += `circuit.append(cirq.H(${t}))\n`;
        break;
      case 'X':
        code += `circuit.append(cirq.X(${t}))\n`;
        break;
      case 'Y':
        code += `circuit.append(cirq.Y(${t}))\n`;
        break;
      case 'Z':
        code += `circuit.append(cirq.Z(${t}))\n`;
        break;
      case 'S':
        code += `circuit.append(cirq.S(${t}))\n`;
        break;
      case 'T':
        code += `circuit.append(cirq.T(${t}))\n`;
        break;
      case 'CNOT':
        code += `circuit.append(cirq.CNOT(${c}, ${t}))\n`;
        break;
      case 'CZ':
        code += `circuit.append(cirq.CZ(${c}, ${t}))\n`;
        break;
      case 'SWAP':
        code += `circuit.append(cirq.SWAP(${t}, qubits[${g.swapTargetQubit ?? (g.targetQubit + 1) % numQ}]))\n`;
        break;
      case 'M':
        code += `circuit.append(cirq.measure(${t}, key='m_${g.targetQubit}'))\n`;
        break;
    }
  }

  code += `\n# Simulate using Cirq Simulator
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1024)
print(result)
`;
  return code;
}

export function generateOpenQASM(circuit: CircuitState): string {
  const sortedGates = [...circuit.gates].sort((a, b) => a.column - b.column);
  const numQ = circuit.numQubits;

  let code = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\nqreg q[${numQ}];\ncreg c[${numQ}];\n\n`;

  for (const g of sortedGates) {
    switch (g.type) {
      case 'H':
        code += `h q[${g.targetQubit}];\n`;
        break;
      case 'X':
        code += `x q[${g.targetQubit}];\n`;
        break;
      case 'Y':
        code += `y q[${g.targetQubit}];\n`;
        break;
      case 'Z':
        code += `z q[${g.targetQubit}];\n`;
        break;
      case 'S':
        code += `s q[${g.targetQubit}];\n`;
        break;
      case 'T':
        code += `t q[${g.targetQubit}];\n`;
        break;
      case 'CNOT':
        code += `cx q[${g.controlQubit ?? 0}], q[${g.targetQubit}];\n`;
        break;
      case 'CZ':
        code += `cz q[${g.controlQubit ?? 0}], q[${g.targetQubit}];\n`;
        break;
      case 'SWAP':
        code += `swap q[${g.targetQubit}], q[${g.swapTargetQubit ?? (g.targetQubit + 1) % numQ}];\n`;
        break;
      case 'BARRIER':
        code += `barrier q;\n`;
        break;
      case 'M':
        code += `measure q[${g.targetQubit}] -> c[${g.targetQubit}];\n`;
        break;
    }
  }

  return code;
}

export function generatePennyLaneCode(circuit: CircuitState): string {
  const sortedGates = [...circuit.gates].sort((a, b) => a.column - b.column);
  const numQ = circuit.numQubits;

  let code = `"""
Generated with QuantamStudio_Bigslayers AI Platform
Xanadu PennyLane Quantum Differentiable Circuit
"""
import pennylane as qml

dev = qml.device("default.qubit", wires=${numQ}, shots=1024)

@qml.qnode(dev)
def quantum_circuit():
`;

  if (sortedGates.length === 0) {
    code += `    return qml.probs(wires=range(${numQ}))\n`;
    return code;
  }

  for (const g of sortedGates) {
    switch (g.type) {
      case 'H':
        code += `    qml.Hadamard(wires=${g.targetQubit})\n`;
        break;
      case 'X':
        code += `    qml.PauliX(wires=${g.targetQubit})\n`;
        break;
      case 'Y':
        code += `    qml.PauliY(wires=${g.targetQubit})\n`;
        break;
      case 'Z':
        code += `    qml.PauliZ(wires=${g.targetQubit})\n`;
        break;
      case 'S':
        code += `    qml.S(wires=${g.targetQubit})\n`;
        break;
      case 'T':
        code += `    qml.T(wires=${g.targetQubit})\n`;
        break;
      case 'CNOT':
        code += `    qml.CNOT(wires=[${g.controlQubit ?? 0}, ${g.targetQubit}])\n`;
        break;
      case 'CZ':
        code += `    qml.CZ(wires=[${g.controlQubit ?? 0}, ${g.targetQubit}])\n`;
        break;
      case 'SWAP':
        code += `    qml.SWAP(wires=[${g.targetQubit}, ${g.swapTargetQubit ?? 1}])\n`;
        break;
    }
  }

  code += `    return qml.probs(wires=range(${numQ}))\n\nprint("State probabilities:", quantum_circuit())\n`;
  return code;
}

export function generateAllFrameworkCodes(circuit: CircuitState) {
  return {
    qiskit: generateQiskitCode(circuit),
    cirq: generateCirqCode(circuit),
    qasm: generateOpenQASM(circuit),
    pennylane: generatePennyLaneCode(circuit),
  };
}
