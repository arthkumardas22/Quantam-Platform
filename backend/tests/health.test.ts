import request from 'supertest';
import app from '../src/server';

describe('GET /api/health', () => {
  it('should return 200 and operational health message', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Quantum Platform Backend is running');
    expect(res.body.platform).toBe('QuantamStudio_Bigslayers');
  });

  it('should return 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/unknown-route-1234');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ROUTE_NOT_FOUND');
  });
});
