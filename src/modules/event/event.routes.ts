import { Router } from 'express';
import { logEvent, listEvents, changeEventStatus } from './event.controller';
import { authenticate } from '../auth/auth.middleware';
import { upload } from '../../config/multer';
import { getAllEvents } from './event.controller';
import { getEventById } from './event.controller';




const router = Router();

// Log a new event
router.post('/', authenticate, logEvent, getAllEvents);
router.post('/', authenticate, upload.single('image'), logEvent);

// List events for a patient
router.get('/patient/:patientId', authenticate, listEvents);

// Update status of an event
router.patch('/:eventId/status', authenticate, changeEventStatus);

router.get('/', authenticate, getAllEvents);

router.get('/:id', authenticate, getEventById);

export default router;
