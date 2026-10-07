import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { getJwtSecret } from '../utils/config';

const adminRoles = new Set(['SUPER_ADMIN', 'STAFF_ADMIN', 'CONTENT_MANAGER']);

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  let userId: string;
  try {
    const payload = jwt.verify(authorization.slice(7), getJwtSecret(), {
      algorithms: ['HS256'],
    });
    if (typeof payload === 'string' || typeof payload.userId !== 'string') {
      throw new Error('Invalid token payload');
    }
    userId = payload.userId;
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }

  try {
    // Check the current role in the database so demoted/deleted users lose access.
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    if (!user || !adminRoles.has(user.role)) {
      res.status(403).json({ message: 'Administrator access required' });
      return;
    }
    next();
  } catch {
    res.status(503).json({ message: 'Unable to verify access' });
  }
}
