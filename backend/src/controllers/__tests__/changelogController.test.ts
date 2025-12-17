import request from 'supertest';
import express from 'express';

// Mock the Mongoose model so tests don't try to connect to MongoDB
jest.mock('../../models/ChangelogEntry', () => ({
  find: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }),
  findOne: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue(null) }),
}));

import changelogRouter from '../../routers/changelogRouter';

// Create an express app instance that mounts only the changelog router
const app = express();
app.use(express.json());
app.use('/api/changelog', changelogRouter as any);

describe('Changelog endpoints (file fallback)', () => {
  test('GET /api/changelog/latest returns 200 and a JSON entry', async () => {
    const res = await request(app).get('/api/changelog/latest').expect(200);

    expect(res.body).toBeDefined();
    // basic shape assertions
    expect(res.body).toHaveProperty('version');
    expect(typeof res.body.version).toBe('string');
    expect(res.body).toHaveProperty('title');
    expect(typeof res.body.title).toBe('string');
  });

  test('GET /api/changelog returns array of entries', async () => {
    const res = await request(app).get('/api/changelog').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
