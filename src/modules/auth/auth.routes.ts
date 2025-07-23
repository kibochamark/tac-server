import { Router, Request, Response } from 'express';
import { register, login } from './auth.controller';
import { authenticate } from './auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// ✅ Protected route
router.get('/profile', authenticate, (req: Request, res: Response) => {
  const user = (req as any).user;
  res.json({ message: `Welcome, user ${user.userId}`, role: user.role });
});

export default router;
