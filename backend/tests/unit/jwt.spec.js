const jwt = require('jsonwebtoken');

describe('JWT helper (unit)', () => {
  it('should sign and verify a token', () => {
    const payload = { id: 1, email: 'test@example.com' };
    const secret = 'test-secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret);
    expect(decoded.id).toBe(1);
    expect(decoded.email).toBe('test@example.com');
  });
});
