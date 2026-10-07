const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const prisma = require('../dist/utils/prisma').default;
const { requireAdmin } = require('../dist/middleware/requireAdmin');
const { getJwtSecret } = require('../dist/utils/config');

const secret = 'test-only-secret-with-at-least-32-characters';
process.env.JWT_SECRET = secret;

async function checkAccess(authorization, user) {
  const original = prisma.user.findUnique;
  const result = { nextCalled: false, databaseCalled: false };
  prisma.user.findUnique = async () => {
    result.databaseCalled = true;
    if (user instanceof Error) throw user;
    return user;
  };
  const req = { header: () => authorization };
  const res = {
    status(code) { result.status = code; return this; },
    json(body) { result.body = body; return this; },
  };
  try {
    await requireAdmin(req, res, () => { result.nextCalled = true; });
    return result;
  } finally {
    prisma.user.findUnique = original;
  }
}

function token(payload, options = {}) {
  return `Bearer ${jwt.sign(payload, secret, { expiresIn: '1h', ...options })}`;
}

test('anonymous and tampered tokens are rejected before a database lookup', async () => {
  for (const value of [undefined, 'Bearer invalid', `Bearer ${jwt.sign({ userId: 'user' }, 'wrong-secret')}`]) {
    const result = await checkAccess(value, { role: 'SUPER_ADMIN' });
    assert.equal(result.status, 401);
    assert.equal(result.databaseCalled, false);
    assert.equal(result.nextCalled, false);
  }
});

test('expired tokens and tokens without user IDs are rejected', async () => {
  for (const value of [token({ userId: 'user' }, { expiresIn: -1 }), token({ role: 'SUPER_ADMIN' })]) {
    assert.equal((await checkAccess(value, { role: 'SUPER_ADMIN' })).status, 401);
  }
});

test('a stale admin claim does not override the current database role', async () => {
  const value = token({ userId: 'user', role: 'SUPER_ADMIN' });
  for (const user of [{ role: 'USER' }, null]) {
    const result = await checkAccess(value, user);
    assert.equal(result.status, 403);
    assert.equal(result.nextCalled, false);
  }
});

test('each supported current admin role can proceed', async () => {
  for (const role of ['SUPER_ADMIN', 'STAFF_ADMIN', 'CONTENT_MANAGER']) {
    const result = await checkAccess(token({ userId: 'user' }), { role });
    assert.equal(result.nextCalled, true);
  }
});

test('a database failure never grants access', async () => {
  const result = await checkAccess(token({ userId: 'user' }), new Error('offline'));
  assert.equal(result.status, 503);
  assert.equal(result.nextCalled, false);
});

test('missing or weak signing secrets fail validation', () => {
  for (const value of ['', 'secret']) {
    process.env.JWT_SECRET = value;
    assert.throws(getJwtSecret, /at least 32 characters/);
  }
  process.env.JWT_SECRET = secret;
  assert.equal(getJwtSecret(), secret);
});

after(async () => { await prisma.$disconnect(); });
