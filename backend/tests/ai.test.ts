import request from 'supertest';
import app from '../src/server';

describe('AI Tutor & Circuit Explainer APIs', () => {
  it('should answer quantum questions via AI chat', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({ message: 'What is the Hadamard gate?' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.message).toContain('Hadamard');
  });

  it('should explain quantum circuit state step-by-step', async () => {
    const circuit = {
      numQubits: 2,
      numColumns: 4,
      gates: [
        { type: 'H', targetQubit: 0, column: 0 },
        { type: 'CNOT', controlQubit: 0, targetQubit: 1, column: 1 },
      ],
    };

    const res = await request(app)
      .post('/api/ai/explain-circuit')
      .send({ circuit });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isEntangled).toBe(true);
    expect(res.body.data.stepByStep.length).toBeGreaterThan(0);
    expect(res.body.data.beginnerTrap).toBeDefined();
  });
});
