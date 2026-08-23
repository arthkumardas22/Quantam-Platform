import request from 'supertest';
import app from '../src/server';

describe('Quantum Simulation APIs', () => {
  it('should accurately simulate Pauli-X gate (|0⟩ → |1⟩)', async () => {
    const circuit = {
      numQubits: 1,
      numColumns: 4,
      gates: [{ type: 'X', targetQubit: 0, column: 0 }],
    };

    const res = await request(app)
      .post('/api/quantum/simulate')
      .send({ circuit, shots: 1024 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.probabilities['1']).toBeCloseTo(1.0, 2);
    expect(res.body.data.counts['1']).toBe(1024);
  });

  it('should accurately simulate Hadamard gate (|0⟩ → (|0⟩+|1⟩)/√2)', async () => {
    const circuit = {
      numQubits: 1,
      numColumns: 4,
      gates: [{ type: 'H', targetQubit: 0, column: 0 }],
    };

    const res = await request(app)
      .post('/api/quantum/simulate')
      .send({ circuit, shots: 1024 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.probabilities['0']).toBeCloseTo(0.5, 1);
    expect(res.body.data.probabilities['1']).toBeCloseTo(0.5, 1);
  });

  it('should accurately simulate Bell State |Φ+⟩ = (|00⟩ + |11⟩)/√2 (Mandatory Verification)', async () => {
    const bellCircuit = {
      numQubits: 2,
      numColumns: 4,
      gates: [
        { type: 'H', targetQubit: 0, column: 0 },
        { type: 'CNOT', controlQubit: 0, targetQubit: 1, column: 1 },
      ],
    };

    const res = await request(app)
      .post('/api/quantum/simulate')
      .send({ circuit: bellCircuit, shots: 1024 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.probabilities['00']).toBeCloseTo(0.5, 1);
    expect(res.body.data.probabilities['11']).toBeCloseTo(0.5, 1);
    expect(res.body.data.probabilities['01']).toBeUndefined();
    expect(res.body.data.probabilities['10']).toBeUndefined();
  });

  it('should compute exact quantum statevector', async () => {
    const bellCircuit = {
      numQubits: 2,
      numColumns: 4,
      gates: [
        { type: 'H', targetQubit: 0, column: 0 },
        { type: 'CNOT', controlQubit: 0, targetQubit: 1, column: 1 },
      ],
    };

    const res = await request(app)
      .post('/api/quantum/statevector')
      .send({ circuit: bellCircuit });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.numQubits).toBe(2);
    expect(res.body.data.amplitudes.length).toBe(4);
  });

  it('should compute Bloch sphere coordinates', async () => {
    const circuit = {
      numQubits: 1,
      numColumns: 4,
      gates: [{ type: 'H', targetQubit: 0, column: 0 }],
    };

    const res = await request(app)
      .post('/api/quantum/bloch-sphere')
      .send({ circuit, qubitIndex: 0 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.x).toBeCloseTo(1.0, 1); // Equatorial +X axis
    expect(res.body.data.z).toBeCloseTo(0.0, 1);
  });
});
