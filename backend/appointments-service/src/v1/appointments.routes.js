import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as ctrl from './appointments.controller.js';

const router = Router();

const STATUS = ['Scheduled', 'Completed', 'Cancelled', 'NoShow'];

// validators
const createVal = [
  body('patientId').isString().notEmpty(),
  body('patientName').isString().notEmpty(),
  body('doctorId').isString().notEmpty(),
  body('doctorName').isString().notEmpty(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('status').optional().isIn(STATUS)
];

const statusVal = [
  param('id').isUUID(),
  body('status').isIn(STATUS)
];

const listVal = [
  query('doctorId').optional().isString(),
  query('patientId').optional().isString(),
  query('status').optional().isIn(STATUS),
  query('from').optional().isISO8601(),
  query('to').optional().isISO8601(),
];

router.post('/', createVal, ctrl.create);
router.get('/', listVal, ctrl.list);
router.get('/:id', param('id').isUUID(), ctrl.getOne);
router.patch('/:id', param('id').isUUID(), ctrl.patch);
router.patch('/:id/status', statusVal, ctrl.setStatus);

export default router;
