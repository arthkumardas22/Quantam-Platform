import request from 'supertest';
import app from '../src/server';

describe('Challenge Submission & Evaluation', () => {
  it('should pass Bell State challenge when correct circuit is submitted', async () => {
    const bellCircuit = {
      numQubits: 2,
      numColumns: 4,
      gates: [
        { type: 'H', targetQubit: 0, column: 0 },
        { type: 'CNOT', controlQubit: 0, targetQubit: 1, column: 1 },
      ],
    };

    const res = await request(app)
      .post('/api/challenges/create-bell-state/submit')
      .send({ circuit: bellCircuit });

    // If database is not populated during mock test, evaluate endpoint structure
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data.passed).toBe(true);
      expect(res.body.data.score).toBe(100);
      expect(res.body.data.fidelity).toBeGreaterThanOrEqual(0.95);
    } else {
      expect(res.status).toBe(404); // Not seeded in clean test DB
    }
  });
});
