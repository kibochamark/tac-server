import { validationResult } from 'express-validator';
import * as svc from './appointments.service.js';
import { sendMockEmail } from './email.mock.js';

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
}

export async function create(req, res) {
  const invalid = handleValidation(req, res);
  if (invalid) return;
  try {
    const data = req.body;
    const appt = await svc.createAppointment(data);

    // pretend email
    sendMockEmail({
      to: data.patientEmail || 'patient@example.com',
      subject: 'Appointment Scheduled',
      text: `Your appointment with ${data.doctorName} is scheduled on ${new Date(data.startTime).toLocaleString()}`,
    });

    res.status(201).json(appt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getOne(req, res) {
  try {
    const id = req.params.id;
    const appt = await svc.getAppointment(id);
    if (!appt) return res.status(404).json({ message: 'Not found' });
    res.json(appt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function list(req, res) {
  try {
    const appts = await svc.listAppointments(req.query);
    res.json(appts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function patch(req, res) {
  try {
    const id = req.params.id;
    const updated = await svc.updateAppointment(id, req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function setStatus(req, res) {
  const invalid = handleValidation(req, res);
  if (invalid) return;
  try {
    const id = req.params.id;
    const updated = await svc.updateStatus(id, req.body.status, req.body.updatedBy);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
