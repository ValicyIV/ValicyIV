import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/insights';

const validPayload = {
  respondent: {
    department: 'Engineering',
    role: 'Engineer',
    location: 'Remote',
    tenure: '1-3 years',
  },
  sentimentScores: [
    { id: 'trust', question: 'Trust in data', score: 4 },
    { id: 'impact', question: 'Impact clarity', score: 5 },
    { id: 'safety', question: 'Safety', score: 4 },
  ],
  adoption: {
    automationReady: true,
    securityAligned: true,
  },
  qualitative: [{ id: 'priorityUseCase', response: 'Speed up incident postmortems' }],
  summary: {
    avg: '4.3',
    text: 'High alignment',
  },
  capturedAt: new Date().toISOString(),
};

describe('/api/insights', () => {
  it('accepts valid payloads', async () => {
    const { req, res } = createMocks({ method: 'POST', body: validPayload });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.success).toBe(true);
  });

  it('rejects invalid payloads', async () => {
    const { req, res } = createMocks({ method: 'POST', body: { ...validPayload, sentimentScores: [] } });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Validation failed');
  });

  it('rejects non-POST methods', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
