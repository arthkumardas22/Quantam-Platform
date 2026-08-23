import request from 'supertest';
import app from '../src/server';

describe('Circuit APIs & Code Generation', () => {
  const sampleCircuit = {
    numQubits: 2,
    numColumns: 4,
    gates: [
      { type: 'H', targetQubit: 0, column: 0 },
      { type: 'CNOT', controlQubit: 0, targetQubit: 1, column: 1 },
    ],
  };

  it('should generate valid Python Qiskit code', async () => {
    const res = await request(app)
      .post('/api/circuits/generate-code')
      .send({ circuit: sampleCircuit, framework: 'qiskit' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.framework).toBe('qiskit');
    expect(res.body.data.code).toContain('from qiskit import QuantumCircuit');
    expect(res.body.data.code).toContain('qc.h(0)');
    expect(res.body.data.code).toContain('qc.cx(0, 1)');
  });

  it('should generate valid Google Cirq code', async () => {
    const res = await request(app)
      .post('/api/circuits/generate-code')
      .send({ circuit: sampleCircuit, framework: 'cirq' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.framework).toBe('cirq');
    expect(res.body.data.code).toContain('import cirq');
    expect(res.body.data.code).toContain('circuit.append(cirq.H(qubits[0]))');
  });

  it('should generate OpenQASM 2.0 code', async () => {
    const res = await request(app)
      .post('/api/circuits/generate-code')
      .send({ circuit: sampleCircuit, framework: 'qasm' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.code).toContain('OPENQASM 2.0;');
    expect(res.body.data.code).toContain('h q[0];');
    expect(res.body.data.code).toContain('cx q[0], q[1];');
  });

  it('should reject invalid gate types', async () => {
    const invalidCircuit = {
      numQubits: 2,
      numColumns: 4,
      gates: [{ type: 'INVALID_GATE', targetQubit: 0, column: 0 }],
    };

    const res = await request(app)
      .post('/api/quantum/simulate')
      .send({ circuit: invalidCircuit });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});
